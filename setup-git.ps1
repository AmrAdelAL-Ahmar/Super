# Script to properly set up git repository
# Stop on first error
$ErrorActionPreference = "Stop"

Write-Host "Setting up git repository..." -ForegroundColor Green

# Step 1: Kill any processes that might be locking git files
Write-Host "Stopping any processes that might be locking git files..." -ForegroundColor Yellow
taskkill /f /im git.exe 2>$null
taskkill /f /im git-lfs.exe 2>$null

# Step 2: Reset git by removing the .git directory
Write-Host "Removing existing git repository..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue

# Step 3: Initialize a new git repository
Write-Host "Initializing a new git repository..." -ForegroundColor Yellow
git init

# Step 4: Configure git user information
Write-Host "Configuring git user information..." -ForegroundColor Yellow
git config --local user.name "AmrAdelAL-Ahmar"
git config --local user.email "amradelsms@gmail.com"  

# Step 5: Add remote repository
Write-Host "Adding remote repository..." -ForegroundColor Yellow
git remote add origin https://github.com/AmrAdelAL-Ahmar/Super.git

# Step 6: Add only necessary files (exclude node_modules)
Write-Host "Adding project files (excluding node_modules)..." -ForegroundColor Yellow
git add README.md
git add client --ignore-errors
git add server --ignore-errors
git add .gitignore

# Step 7: Commit changes
Write-Host "Committing initial files..." -ForegroundColor Yellow
git commit -m "Initial commit"

Write-Host "Git repository setup complete!" -ForegroundColor Green
Write-Host "You can now push to your remote repository with: git push -u origin master" -ForegroundColor Cyan 