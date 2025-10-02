// Test database connection and data saving
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cfchzzafdoobcezfftxb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2h6emFmZG9vYmNlemZmdHhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMjUxMjAsImV4cCI6MjA3NDcwMTEyMH0.c7VS1dznFpI0BH-mtpgQuucp6tUGvddCKhj6IS8cO7w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  console.log('🔍 Testing database connection...');
  
  try {
    // Test 1: Check if we can connect
    const { data: testData, error: testError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Connection failed:', testError);
      return;
    }
    
    console.log('✅ Database connection successful');
    
    // Test 2: Try to create a test user profile
    const testUserId = '4ca35001-f763-45c7-bdfc-68f7df1234567'; // Example UUID
    
    console.log('🧪 Testing profile creation...');
    
    // First, try to insert into profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: testUserId,
        email: 'test@example.com',
        full_name: 'Test User'
      })
      .select();
    
    if (profileError) {
      console.error('❌ Profile creation failed:', profileError);
    } else {
      console.log('✅ Profile created:', profileData);
    }
    
    // Then, try to insert into user_profiles
    const { data: userProfileData, error: userProfileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: testUserId,
        gender: 'male',
        age: 25,
        height_cm: 175,
        weight_kg: 70,
        activity_level: 'moderate',
        goal: 'maintain_weight',
        onboarding_completed: true
      })
      .select();
    
    if (userProfileError) {
      console.error('❌ User profile creation failed:', userProfileError);
    } else {
      console.log('✅ User profile created:', userProfileData);
    }
    
    // Test 3: Try to read the data back
    const { data: readData, error: readError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', testUserId);
    
    if (readError) {
      console.error('❌ Read failed:', readError);
    } else {
      console.log('✅ Data read successfully:', readData);
    }
    
    // Clean up test data
    await supabase.from('user_profiles').delete().eq('id', testUserId);
    await supabase.from('profiles').delete().eq('id', testUserId);
    console.log('🧹 Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the test
testDatabase();
