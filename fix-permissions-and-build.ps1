# PowerShell script to fix permission issues and build
Write-Host "Fixing CalorieSnap Build Permission Issues" -ForegroundColor Green

# Create a temporary directory outside OneDrive
$tempDir = "C:\temp\CalorieSnap-Build"
$sourceDir = Get-Location

Write-Host "Creating temporary build directory: $tempDir" -ForegroundColor Yellow

# Remove existing temp directory if it exists
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
}

# Create new temp directory
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

Write-Host "Copying essential project files..." -ForegroundColor Yellow

# Copy essential files and directories
$essentialItems = @(
    "app",
    "assets", 
    "components",
    "contexts",
    "lib",
    "utils",
    "app.json",
    "eas.json",
    "package.json",
    "tsconfig.json",
    "metro.config.js",
    ".env",
    ".easignore"
)

foreach ($item in $essentialItems) {
    $sourcePath = Join-Path $sourceDir $item
    $destPath = Join-Path $tempDir $item
    
    if (Test-Path $sourcePath) {
        if (Test-Path $sourcePath -PathType Container) {
            # It's a directory
            Copy-Item -Recurse -Path $sourcePath -Destination $destPath -Force
            Write-Host "Copied directory: $item" -ForegroundColor Green
        } else {
            # It's a file
            Copy-Item -Path $sourcePath -Destination $destPath -Force
            Write-Host "Copied file: $item" -ForegroundColor Green
        }
    } else {
        Write-Host "Skipped missing: $item" -ForegroundColor Yellow
    }
}

Write-Host "Changing to temporary directory..." -ForegroundColor Yellow
Set-Location $tempDir

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps

Write-Host "Starting EAS build..." -ForegroundColor Yellow
eas build --platform android --profile preview --no-wait

Write-Host "Build submitted! Check the logs URL provided above." -ForegroundColor Green
Write-Host "Temporary build directory: $tempDir" -ForegroundColor Cyan
Write-Host "You can delete this directory after the build completes." -ForegroundColor Cyan

# Return to original directory
Set-Location $sourceDir
