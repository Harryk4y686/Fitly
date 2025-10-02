# Service Account Setup for Vision API

You've provided a service account JSON file for project `elegant-skein-473614-v2`. To use this service account with the Vision API, follow these steps:

## Project Details
- **Project ID:** elegant-skein-473614-v2
- **Service Account Email:** zeroa-506@elegant-skein-473614-v2.iam.gserviceaccount.com

## Steps to Enable Vision API

### 1. Enable Vision API for Your Service Account Project

**Direct link to enable:** 
https://console.cloud.google.com/apis/library/vision.googleapis.com?project=elegant-skein-473614-v2

1. Click the link above (make sure you're logged into the correct Google account)
2. Click **"ENABLE"** button
3. Wait for the API to activate (usually takes a few seconds)

### 2. Check Project Billing

**Direct link to billing:** 
https://console.cloud.google.com/billing/linkedaccount?project=elegant-skein-473614-v2

- Ensure billing is enabled for the project
- Vision API requires billing (but has 1000 free requests per month)

### 3. Verify Service Account Permissions

**Direct link to IAM:** 
https://console.cloud.google.com/iam-admin/iam?project=elegant-skein-473614-v2

Your service account should have at least one of these roles:
- **Cloud Vision API User** (recommended)
- **Editor** 
- **Owner**

### 4. Test the Configuration

After enabling the API and setting up billing, restart your app and try scanning food again. The app will:
1. Use the service account credentials from `elegant-skein-473614-v2-4e1db5a61efb.json`
2. Authenticate with Google Cloud
3. Send images to Vision API for analysis

## Troubleshooting

### If you still get 403 errors:
1. Make sure you're the owner of project `elegant-skein-473614-v2`
2. Check that Vision API is enabled (link above)
3. Verify billing is active
4. Try creating a new API key for the project

### To create an API key for the service account project:
1. Go to: https://console.cloud.google.com/apis/credentials?project=elegant-skein-473614-v2
2. Click **"+ CREATE CREDENTIALS"** → **"API key"**
3. Copy the new API key
4. Update your `.env` file:
   ```
   EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY=your-new-api-key-here
   ```

## Current Implementation

The app is now configured to:
1. Use service account authentication when available
2. Fall back to API key authentication if service account fails
3. Use mock data as last resort

The service account provides better security and doesn't expose API keys in the app.

## Quick Links
- [Enable Vision API](https://console.cloud.google.com/apis/library/vision.googleapis.com?project=elegant-skein-473614-v2)
- [Project Dashboard](https://console.cloud.google.com/home/dashboard?project=elegant-skein-473614-v2)
- [Billing Settings](https://console.cloud.google.com/billing/linkedaccount?project=elegant-skein-473614-v2)
- [API Credentials](https://console.cloud.google.com/apis/credentials?project=elegant-skein-473614-v2)
- [IAM Permissions](https://console.cloud.google.com/iam-admin/iam?project=elegant-skein-473614-v2)
