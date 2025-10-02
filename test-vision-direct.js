// Test Google Cloud Vision API directly
const https = require('https');

// Your Google Cloud API key
const API_KEY = 'AIzaSyC_g0i1IMCFlG__fOxtX_k4cEjOU0K6SDg';

// Test with a simple base64 image (1x1 pixel)
const testImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

function testVisionAPI() {
  console.log('=================================');
  console.log('Testing Google Cloud Vision API...');
  console.log('API Key:', API_KEY ? 'Present' : 'Missing');
  console.log('=================================\n');
  
  const requestBody = JSON.stringify({
    requests: [
      {
        image: {
          content: testImage
        },
        features: [
          {
            type: 'LABEL_DETECTION',
            maxResults: 10
          }
        ]
      }
    ]
  });

  const options = {
    hostname: 'vision.googleapis.com',
    path: `/v1/images:annotate?key=${API_KEY}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': requestBody.length
    }
  };

  console.log('📤 Sending request to Vision API...\n');
  
  const req = https.request(options, (res) => {
    console.log('📥 Response Status:', res.statusCode);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('\n📄 Response Body:');
      
      try {
        const jsonData = JSON.parse(data);
        console.log(JSON.stringify(jsonData, null, 2));
        
        if (res.statusCode === 200) {
          console.log('\n✅ SUCCESS: Vision API is working!');
          if (jsonData.responses && jsonData.responses[0]) {
            const labels = jsonData.responses[0].labelAnnotations;
            if (labels) {
              console.log('\n🏷️ Detected labels:');
              labels.forEach((label, i) => {
                console.log(`  ${i + 1}. ${label.description} (${Math.round(label.score * 100)}%)`);
              });
            }
          }
          console.log('\n✅ Your Google Cloud Vision API is configured correctly!');
          console.log('✅ The app should be able to analyze food images now.');
        } else {
          console.log('\n❌ FAILED: Vision API returned error');
          if (jsonData.error) {
            console.log('\n📛 Error Details:');
            console.log('  Message:', jsonData.error.message);
            console.log('  Code:', jsonData.error.code);
            console.log('  Status:', jsonData.error.status);
            
            if (jsonData.error.message.includes('billing')) {
              console.log('\n💳 BILLING ISSUE DETECTED!');
              console.log('  Solution: Enable billing for your Google Cloud project');
              console.log('  Go to: https://console.cloud.google.com/billing');
            }
            
            if (jsonData.error.message.includes('API has not been used')) {
              console.log('\n🔧 API NOT ENABLED!');
              console.log('  Solution: Enable the Vision API for your project');
              console.log('  Go to: https://console.cloud.google.com/apis/library/vision.googleapis.com');
            }
            
            if (jsonData.error.code === 403) {
              console.log('\n🔑 POSSIBLE ISSUES:');
              console.log('  1. API key is invalid or expired');
              console.log('  2. Vision API not enabled for this project');
              console.log('  3. Billing not enabled for the project');
              console.log('  4. API key restrictions blocking access');
            }
          }
        }
      } catch (e) {
        console.log('Raw response:', data);
        console.log('\n⚠️ Could not parse response as JSON');
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('\n❌ Connection failed:', error);
  });
  
  req.write(requestBody);
  req.end();
}

// Run the test
testVisionAPI();
