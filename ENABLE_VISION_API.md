# How to Enable Google Cloud Vision API

Your API key `AIzaSyC_g0i1IMCFlG__fOxtX_k4cEjOU0K6SDg` is showing a 403 error, which means the Vision API is not enabled or there's a permission issue.

## Steps to Fix:

### 1. Enable Vision API in Google Cloud Console
1. Go to: https://console.cloud.google.com/apis/library/vision.googleapis.com
2. Make sure you're in the correct project (check the project dropdown at the top)
3. Click **"ENABLE"** button if the API is not already enabled
4. Wait a few seconds for the API to activate

### 2. Check API Key Restrictions
1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your API key (the one ending in `...K6SDg`)
3. Click on it to edit
4. Under **"API restrictions"**, make sure either:
   - "Don't restrict key" is selected, OR
   - "Cloud Vision API" is included in the allowed APIs list

### 3. Verify Billing is Enabled
1. Go to: https://console.cloud.google.com/billing
2. Make sure your project has an active billing account
3. Vision API requires billing to be enabled (even with free tier)

### 4. Test Your API Key
After completing the above steps, run this command in the CalorieSnap folder:
```bash
node test-vision-api.js
```

If successful, you should see:
- ✅ SUCCESS! Vision API is working properly!
- Detected labels from the test image

### 5. Alternative: Create a New Project
If the above doesn't work, create a fresh project:
1. Go to: https://console.cloud.google.com
2. Click the project dropdown → "New Project"
3. Name it "CalorieSnap" or similar
4. After creation, enable Vision API
5. Create a new API key
6. Update the .env file with the new key

### Common Issues:
- **403 Error**: API not enabled or billing not set up
- **401 Error**: Invalid API key
- **429 Error**: Rate limit exceeded (wait a bit)

### Quick Links:
- [Enable Vision API](https://console.cloud.google.com/apis/library/vision.googleapis.com)
- [API Credentials](https://console.cloud.google.com/apis/credentials)
- [Billing Settings](https://console.cloud.google.com/billing)
- [Vision API Pricing](https://cloud.google.com/vision/pricing) (1000 requests/month free)
