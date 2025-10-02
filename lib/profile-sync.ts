import { supabase } from './supabase';

export const syncUserProfile = async () => {
  try {
    console.log('=== PROFILE SYNC START ===');
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('No authenticated user found:', userError);
      return { success: false, error: userError };
    }

    console.log('Syncing profile for user:', user.id);

    // Simply try to create a basic profile entry
    // If it already exists, upsert will handle it
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        onboarding_completed: false
      })
      .select()
      .single();

    if (error) {
      console.error('Profile sync error:', error);
      return { success: false, error };
    }

    console.log('Profile sync successful:', data);
    return { success: true, data };

  } catch (error) {
    console.error('Profile sync failed:', error);
    return { success: false, error };
  }
};

export const ensureUserProfileExists = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;

    // Check both profiles and user_profiles tables
    const [profilesResult, userProfilesResult] = await Promise.all([
      supabase.from('profiles').select('id').eq('id', user.id).single(),
      supabase.from('user_profiles').select('id').eq('id', user.id).single()
    ]);

    // Create profiles entry if missing
    if (profilesResult.error && profilesResult.error.code === 'PGRST116') {
      console.log('Creating missing profiles entry...');
      await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
      });
    }

    // Create user_profiles entry if missing
    if (userProfilesResult.error && userProfilesResult.error.code === 'PGRST116') {
      console.log('Creating missing user_profiles entry...');
      await supabase.from('user_profiles').insert({
        id: user.id
      });
    }

    return true;
  } catch (error) {
    console.error('Error ensuring user profile exists:', error);
    return false;
  }
};
