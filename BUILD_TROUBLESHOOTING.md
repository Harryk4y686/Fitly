# 🔧 CalorieSnap Build Troubleshooting Guide

## 1. Check Detailed Build Logs

First, get the actual error details:

### Run with more verbose logging
```bash
# For Expo builds
eas build --platform android --profile preview --clear-cache

# For even more details
eas build --platform android --profile preview --non-interactive
```

### For Gradle-specific issues (if using bare workflow)
```bash
# Clean and rebuild
./gradlew clean
./gradlew build
```

## 2. Common Causes & Solutions

### 🔧 Gradle Issues

#### Delete gradle caches
```bash
rm -rf ~/.gradle/caches/
./gradlew clean
```

#### For Windows PowerShell:
```powershell
Remove-Item -Recurse -Force ~/.gradle/caches/
```

### 📦 Node/NPM Issues

#### Clear npm cache
```bash
npm cache clean --force
```

#### Remove and reinstall dependencies
```bash
# Windows PowerShell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Then reinstall
npm install --legacy-peer-deps
```

### 🌍 Environment Variables

#### Check local .env file
Ensure these variables exist in `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=your_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key_here
EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY=your_api_key_here
```

#### Check EAS secrets
```bash
# List all secrets
eas env:list

# Create missing secrets
eas env:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "your_url"
eas env:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your_key"
eas env:create --scope project --name EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY --value "your_api_key"
```

### 🏗️ Build Configuration

#### Validate eas.json
```json
{
  "cli": {
    "version": ">= 16.20.0",
    "appVersionSource": "remote"
  },
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true,
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

## 3. Step-by-Step Debug Process

### Step 1: Clean Everything
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
Remove-Item -Recurse -Force node_modules

# Remove package-lock.json
Remove-Item -Force package-lock.json

# Reinstall dependencies
npm install --legacy-peer-deps
```

### Step 2: Verify Configuration
```bash
# Check EAS configuration
eas build:configure

# Validate environment variables
eas env:list
```

### Step 3: Try Build with Debug Options
```bash
# Build with cache clearing
eas build --platform android --profile preview --clear-cache

# If that fails, try with more verbose output
eas build --platform android --profile preview --non-interactive
```

### Step 4: Check Build Logs
```bash
# List recent builds
eas build:list

# View specific build logs
eas build:view [BUILD_ID]
```

## 4. Common Error Solutions

### "Module not found" errors
- Run `npm install --legacy-peer-deps`
- Check if all required dependencies are in package.json

### "Build failed" with no details
- Check the EAS build logs URL provided in the output
- Look for specific error messages in the logs

### Environment variable issues
- Ensure all secrets are created on EAS
- Check that variable names match exactly (including EXPO_PUBLIC_ prefix)

### Gradle/Android build issues
- Clear build cache with `--clear-cache` flag
- Check if any native dependencies need additional configuration

## 5. Emergency Fixes

### If all else fails:
1. Create a fresh Expo project
2. Copy your source code to the new project
3. Reinstall dependencies one by one
4. Test build after each major dependency

### Rollback strategy:
1. Check your git history for last working commit
2. Revert to that commit
3. Identify what changed since then

## 6. Prevention Tips

- Always test builds after adding new dependencies
- Keep environment variables in sync between local and EAS
- Use `--legacy-peer-deps` consistently
- Regularly clean caches during development

---

## Quick Command Reference

```bash
# Clean and rebuild everything
npm cache clean --force
Remove-Item -Recurse -Force node_modules
npm install --legacy-peer-deps
eas build --platform android --profile preview --clear-cache

# Check configuration
eas env:list
eas build:list

# Debug build
eas build --platform android --profile preview --non-interactive
```
