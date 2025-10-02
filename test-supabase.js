// Quick Supabase connection test
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfchzzafdoobcezfftxb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2h6emFmZG9vYmNlemZmdHhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMjUxMjAsImV4cCI6MjA3NDcwMTEyMH0.c7VS1dznFpI0BH-mtpgQuucp6tUGvddCKhj6IS8cO7w';

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key (first 20 chars):', supabaseKey.substring(0, 20));

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test basic connection
    console.log('\n1. Testing basic connection...');
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      console.error('Error details:', error);
    } else {
      console.log('✅ Basic connection successful');
    }

    // Test auth
    console.log('\n2. Testing auth...');
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('ℹ️ No authenticated user (expected):', authError.message);
    } else {
      console.log('✅ Auth working, user:', authData.user?.email || 'No user');
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testConnection();
