// Simple Node.js test to verify Supabase connection
const https = require('https');

const supabaseUrl = 'https://cfchzzafdoobcezfftxb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2h6emFmZG9vYmNlemZmdHhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMjUxMjAsImV4cCI6MjA3NDcwMTEyMH0.c7VS1dznFpI0BH-mtpgQuucp6tUGvddCKhj6IS8cO7w';

console.log('🔍 Testing Supabase connection...');

const options = {
  hostname: 'cfchzzafdoobcezfftxb.supabase.co',
  port: 443,
  path: '/rest/v1/user_profiles?select=count',
  method: 'GET',
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response:', data);
    
    if (res.statusCode === 200) {
      console.log('✅ Supabase connection working!');
    } else {
      console.log('❌ Supabase connection failed');
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request error:', e.message);
});

req.end();
