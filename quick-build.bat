@echo off
echo Initializing git repository...
git init
git add .
git commit -m "Initial commit for build"

echo Starting EAS build...
eas build --platform android --profile preview --no-wait

pause
