# 🚀 SOLUTION: Move Project Outside OneDrive

## Problem
EAS Build cannot read files in OneDrive folders due to Windows permission restrictions.

## Solution Steps

### 1. Create New Directory Outside OneDrive
```cmd
mkdir C:\Projects
cd C:\Projects
```

### 2. Copy Project to New Location
```cmd
xcopy "C:\Users\grant\OneDrive\1Portofolio Buat Uni\Coding\Calorie_tracke_ AI\CalorieSnap" "C:\Projects\CalorieSnap" /E /I /H /Y
```

### 3. Navigate to New Project Directory
```cmd
cd C:\Projects\CalorieSnap
```

### 4. Initialize Git Repository
```cmd
git init
git add .
git commit -m "Initial commit for EAS build"
```

### 5. Install Dependencies
```cmd
npm install --legacy-peer-deps
```

### 6. Build Successfully
```cmd
eas build --platform android --profile preview --no-wait
```

## Why This Works
- C:\Projects\ is outside OneDrive sync
- No restrictive permissions applied
- EAS can read all files during compression
- Git repository properly initialized

## Alternative: Use PowerShell Script
Run the existing script which does this automatically:
```powershell
PowerShell -ExecutionPolicy Bypass -File "fix-permissions-and-build.ps1"
```
When prompted about git init, type 'Y' and press Enter.

## Result
✅ Clean build environment
✅ No permission errors
✅ Successful EAS build submission
