import { supabase } from './supabase';

export const testDatabaseConnection = async () => {
  try {
    console.log('Testing database connection...');
    
    // Test 1: Check if we can connect to Supabase
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Auth error:', authError);
      return false;
    }
    
    if (!authData.user) {
      console.log('No authenticated user found');
      return false;
    }
    
    console.log('Authenticated user:', authData.user.id);
    
    // Test 2: Check if user_profiles table exists and we can query it
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (profileError) {
      console.log('Profile query error (this might be normal if profile doesn\'t exist):', profileError);
      
      // Test 3: Try to create a profile
      console.log('Attempting to create profile...');
      const { data: insertData, error: insertError } = await supabase
        .from('user_profiles')
        .insert({ id: authData.user.id })
        .select()
        .single();
      
      if (insertError) {
        console.error('Insert error:', insertError);
        return false;
      }
      
      console.log('Profile created successfully:', insertData);
      return true;
    }
    
    console.log('Existing profile found:', profileData);
    return true;
    
  } catch (error) {
    console.error('Database test failed:', error);
    return false;
  }
};

export const testProfileUpdate = async (userId: string, testData: any) => {
  try {
    console.log('Testing profile update for user:', userId);
    console.log('Test data:', testData);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({ id: userId, ...testData })
      .select()
      .single();
    
    if (error) {
      console.error('Update test failed:', error);
      return false;
    }
    
    console.log('Update test successful:', data);
    return true;
  } catch (error) {
    console.error('Update test error:', error);
    return false;
  }
};
