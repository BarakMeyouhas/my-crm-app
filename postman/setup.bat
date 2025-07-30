@echo off
REM CRM App Postman CLI Setup Script for Windows
REM This script sets up Newman and runs initial tests

echo 🚀 Setting up Postman CLI (Newman) for CRM App...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install Newman globally
echo 📦 Installing Newman (Postman CLI)...
npm install -g newman

REM Install Newman HTML reporter
echo 📦 Installing Newman HTML reporter...
npm install -g newman-reporter-html

REM Install local dependencies
echo 📦 Installing local dependencies...
npm install

echo ✅ Newman setup complete!

REM Check if backend server is running
echo 🔍 Checking if backend server is running...
curl -s http://localhost:5000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend server is running on http://localhost:5000
) else (
    echo ⚠️  Backend server is not running on http://localhost:5000
    echo    Please start your backend server with: cd backend ^&^& npm run dev
    echo    Then run this script again.
    pause
    exit /b 1
)

REM Run initial test
echo 🧪 Running initial test...
npm test

echo.
echo 🎉 Setup complete! You can now use the following commands:
echo.
echo   npm test                    # Run all tests
echo   npm run test:auth          # Run authentication tests
echo   npm run test:companies     # Run company tests
echo   npm run test:clients       # Run client tests
echo   npm run test:service-requests # Run service request tests
echo   npm run test:admin         # Run admin tests
echo   npm run test:verbose       # Run with verbose output
echo   npm run generate:html      # Generate HTML report
echo.
echo 📚 For more information, see README.md
pause 