# E2E Testing Setup

This directory contains End-to-End (E2E) tests for the Angular CRM application using Protractor.

## 🚀 Quick Start

### Run E2E Tests (Recommended)
```bash
cd frontend
node e2e/run-e2e-clean.js
```

### Alternative: Windows Batch File
```cmd
cd frontend
e2e\run-tests-windows.bat
```

### Manual Angular CLI
```bash
cd frontend
ng e2e
```

## 📁 File Structure

### Essential Scripts
- **`run-e2e-clean.js`** - Main E2E test runner with cleanup and ChromeDriver 138
- **`download-chromedriver-ci-style.js`** - ChromeDriver 138 downloader (CI-style)
- **`run-tests-windows.bat`** - Windows batch file for easy execution

### Test Files
- **`app.e2e-spec.ts`** - Main application tests (landing, navigation, auth protection)
- **`auth.e2e-spec.ts`** - Authentication tests (login, register)
- **`setup.e2e-spec.ts`** - Environment setup verification
- **`dashboard.e2e-spec.ts`** - Dashboard and admin panel tests
- **`client-management.e2e-spec.ts`** - Client management tests
- **`service-requests.e2e-spec.ts`** - Service request tests

### Documentation
- **`TEST_FIXES_SUMMARY.md`** - Summary of all E2E test fixes applied
- **`GITHUB_ACTIONS_READY.md`** - Guide for GitHub Actions CI setup
- **`README.md`** - This file

### Configuration
- **`protractor.conf.js`** - Protractor configuration (in frontend root)
- **`tsconfig.e2e.json`** - TypeScript configuration for E2E tests
- **`app.po.ts`** - Page Object Model for app component

## 🔧 ChromeDriver Setup

The E2E tests use ChromeDriver 138 to match Chrome browser version 138. The setup is handled automatically by the run scripts.

### Manual ChromeDriver Download
If needed, run:
```bash
cd frontend
node e2e/download-chromedriver-ci-style.js
```

## 🧪 Test Categories

### 1. Application Core (`app.e2e-spec.ts`)
- Landing page functionality
- Navigation between pages
- Authentication protection
- Responsive design
- Performance metrics

### 2. Authentication (`auth.e2e-spec.ts`)
- User registration
- User login
- Form validation
- Error handling

### 3. Environment Setup (`setup.e2e-spec.ts`)
- Frontend accessibility
- Backend connectivity
- Browser environment
- Database connectivity

### 4. Dashboard (`dashboard.e2e-spec.ts`)
- Dashboard access protection
- Admin panel functionality
- User role verification

### 5. Client Management (`client-management.e2e-spec.ts`)
- Client list access protection
- Client management interface
- CRUD operations verification

### 6. Service Requests (`service-requests.e2e-spec.ts`)
- Service request access protection
- Service request management
- Request workflow verification

## ⚙️ Configuration

### Protractor Configuration
Key settings in `protractor.conf.js`:
- **ChromeDriver 138**: Manual download and path configuration
- **Timeout**: 180 seconds for all scripts
- **Headless Mode**: Enabled for CI compatibility
- **WebDriver Manager**: Disabled to prevent conflicts

### Environment Variables
- `CHROMEDRIVER_PATH`: Path to ChromeDriver 138 executable
- `WEBDRIVER_MANAGER_CHROMEDRIVER`: Set to 'false' to prevent conflicts
- `WEBDRIVER_MANAGER_GECKODRIVER`: Set to 'false' to prevent conflicts

## 🚨 Troubleshooting

### Common Issues

1. **ChromeDriver Version Mismatch**
   ```bash
   # Solution: Download correct version
   node e2e/download-chromedriver-ci-style.js
   ```

2. **Too Many Chrome Processes**
   ```bash
   # Solution: Use clean runner
   node e2e/run-e2e-clean.js
   ```

3. **Script Timeout**
   ```bash
   # Solution: Increased timeouts in protractor.conf.js
   # AllScriptsTimeout: 180000
   ```

4. **Element Not Found**
   ```bash
   # Solution: Better wait strategies implemented
   # Using browser.waitForAngular() and ExpectedConditions
   ```

### Performance Tips

1. **Clean Environment**: Always use `run-e2e-clean.js` to avoid process conflicts
2. **Headless Mode**: Tests run faster in headless mode (default)
3. **Timeout Management**: 10-minute timeout prevents infinite hanging
4. **Process Cleanup**: Automatic cleanup prevents resource conflicts

## 📊 Test Results

### Expected Output
```
🧪 E2E Test Runner - Clean Environment
=======================================
✅ Chrome processes cleaned
✅ ChromeDriver processes cleaned
✅ Using ChromeDriver at: C:\...\chromedriver.exe
🚀 Starting E2E tests...
✅ E2E tests completed successfully!
```

### Success Indicators
- ✅ All test suites pass
- ✅ No ChromeDriver version errors
- ✅ No script timeout errors
- ✅ No element not found errors
- ✅ Clean process termination

## 🔄 CI/CD Integration

The E2E tests are configured for GitHub Actions CI. See `GITHUB_ACTIONS_READY.md` for detailed setup instructions.

### CI Configuration
- Uses same ChromeDriver 138 approach as local
- Disabled webdriver-manager conflicts
- Proper environment variable setup
- 10-minute timeout protection

## 📝 Development Notes

### Recent Fixes Applied
- ChromeDriver version mismatch resolved
- WebDriver manager conflicts prevented
- Improved wait strategies implemented
- Better error handling added
- Process cleanup automation

### Test Reliability Improvements
- Replaced `browser.sleep()` with `browser.waitForAngular()`
- Added explicit waits with `ExpectedConditions`
- Implemented try-catch error handling
- Increased timeouts for stability
- Disabled Protractor control flow manager 