@echo off
echo 🧪 Setting up and running E2E tests on Windows
echo ==============================================

echo.
echo 📦 Downloading ChromeDriver 138 (CI Style)...
call node e2e/download-chromedriver-ci-style.js

echo.
echo 🚀 Running basic test...
set CHROMEDRIVER_PATH=%~dp0..\chromedriver.exe
call node e2e/run-basic-test.js

echo.
echo ✅ Test completed!
pause 