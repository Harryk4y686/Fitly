import { supabase } from './supabase';

/**
 * Ensures that both profiles and user_profiles entries exist for the authenticated user
 * This should be called after successful login/signup
 */
export const ensureUserProfilesExist = async () => {
  try {
    console.log('=== ENSURING USER PROFILES EXIST ===');
    
    // Get current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('No authenticated user found:', userError);
      return { success: false, error: userError || new Error('No user found') };
    }

    console.log('Ensuring profiles exist for user:', user.id);

    // Check if profiles entry exists
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    // Create profiles entry if missing
    if (profileError && profileError.code === 'PGRST116') {
      console.log('Creating missing profiles entry...');
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
        });

      if (createProfileError) {
        console.error('Failed to create profiles entry:', createProfileError);
        return { success: false, error: createProfileError };
      }
      console.log('✅ Profiles entry created successfully');
    } else if (profileError) {
      console.error('Error checking profiles:', profileError);
      return { success: false, error: profileError };
    } else {
      console.log('✅ Profiles entry already exists');
    }

    // Check if user_profiles entry exists
    const { data: userProfileData, error: userProfileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    // Create user_profiles entry if missing
    if (userProfileError && userProfileError.code === 'PGRST116') {
      console.log('Creating missing user_profiles entry...');
      const { error: createUserProfileError } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          onboarding_completed: false
        });

      if (createUserProfileError) {
        console.error('Failed to create user_profiles entry:', createUserProfileError);
        return { success: false, error: createUserProfileError };
      }
      console.log('✅ User_profiles entry created successfully');
    } else if (userProfileError) {
      console.error('Error checking user_profiles:', userProfileError);
      return { success: false, error: userProfileError };
    } else {
      console.log('✅ User_profiles entry already exists');
    }

    console.log('=== ALL PROFILES VERIFIED ===');
    return { success: true };

  } catch (error) {
    console.error('Unexpected error ensuring profiles exist:', error);
    return { success: false, error };
  }
};

/**
 * Comprehensive database connection test
 */
export const testDatabaseConnection = async () => {
  try {
    console.log('=== TESTING DATABASE CONNECTION ===');
    
    // Test 1: Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Auth error:', authError);
      return { success: false, error: authError, step: 'authentication' };
    }
    
    if (!user) {
      console.log('❌ No authenticated user found');
      return { success: false, error: new Error('No authenticated user'), step: 'authentication' };
    }
    
    console.log('✅ User authenticated:', user.id);
    
    // Test 2: Test basic query permissions
    const { data: testData, error: queryError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .limit(1);
    
    if (queryError) {
      console.error('❌ Query permission error:', queryError);
      return { success: false, error: queryError, step: 'query_permissions' };
    }
    
    console.log('✅ Query permissions working');
    
    // Test 3: Ensure profiles exist
    const profileResult = await ensureUserProfilesExist();
    if (!profileResult.success) {
      console.error('❌ Failed to ensure profiles exist:', profileResult.error);
      return { success: false, error: profileResult.error, step: 'profile_creation' };
    }
    
    // Test 4: Test insert/update permissions
    const { data: updateData, error: updateError } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (updateError) {
      console.error('❌ Update permission error:', updateError);
      return { success: false, error: updateError, step: 'update_permissions' };
    }
    
    console.log('✅ Update permissions working');
    console.log('=== DATABASE CONNECTION TEST PASSED ===');
    
    return { 
      success: true, 
      user,
      profile: updateData
    };
    
  } catch (error) {
    console.error('❌ Unexpected database test error:', error);
    return { success: false, error, step: 'unexpected_error' };
  }
};

/**
 * Safe profile update with comprehensive error handling
 */
export const safeUpdateUserProfile = async (userId: string, updates: any) => {
  try {
    console.log('=== SAFE PROFILE UPDATE ===');
    console.log('User ID:', userId);
    console.log('Updates:', JSON.stringify(updates, null, 2));
    
    // First ensure the profile exists
    const profileResult = await ensureUserProfilesExist();
    if (!profileResult.success) {
      console.error('Failed to ensure profile exists:', profileResult.error);
      return { success: false, error: profileResult.error };
    }
    
    // Perform the update
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        ...updates,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Update failed:', error);
      return { success: false, error };
    }
    
    console.log('✅ Profile updated successfully:', data);
    
    // Verify the update by querying back
    const { data: verifyData, error: verifyError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (verifyError) {
      console.error('⚠️ Verification query failed:', verifyError);
    } else {
      console.log('✅ Update verified:', verifyData);
    }
    
    return { success: true, data };
    
  } catch (error) {
    console.error('❌ Unexpected update error:', error);
    return { success: false, error };
  }
};
