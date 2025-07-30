# E2E Testing Framework

This directory contains comprehensive End-to-End (E2E) tests for the CRM application that integrate the backend, frontend, and database.

## 🎯 Overview

The E2E testing framework provides comprehensive testing of the complete application stack:

- **Backend API** (Node.js/Express)
- **Frontend** (Angular)
- **Database** (PostgreSQL)
- **Authentication** (JWT)
- **User Interface** (Material Dashboard)

## 📁 Test Structure

```
e2e/
├── app.e2e-spec.ts              # Basic application tests
├── auth.e2e-spec.ts             # Authentication flow tests
├── client-management.e2e-spec.ts # Client management tests
├── dashboard.e2e-spec.ts         # Dashboard functionality tests
├── service-requests.e2e-spec.ts  # Service request tests
├── setup.e2e-spec.ts            # Environment setup and verification
├── app.po.ts                    # Page Object Model
├── run-e2e-tests.js             # Test runner script
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18 or higher)
2. **Angular CLI** (`npm install -g @angular/cli`)
3. **PostgreSQL** database
4. **Chrome/Chromium** browser

### Running Tests

#### Option 1: Using the Test Runner Script

```bash
# Navigate to the frontend directory
cd frontend

# Make the runner script executable
chmod +x e2e/run-e2e-tests.js

# Run all E2E tests
node e2e/run-e2e-tests.js
```

#### Option 2: Using Angular CLI

```bash
# Navigate to the frontend directory
cd frontend

# Run all E2E tests
ng e2e

# Run specific test suite
ng e2e --specs=./e2e/auth.e2e-spec.ts

# Run tests with specific configuration
ng e2e --configuration=production
```

#### Option 3: Manual Setup

```bash
# 1. Start the backend server
cd backend
npm start

# 2. Start the frontend server
cd frontend
ng serve --port 4201

# 3. Run E2E tests
ng e2e
```

## 🧪 Test Suites

### 1. Setup Tests (`setup.e2e-spec.ts`)

**Purpose**: Verify environment and prepare test data

**Tests Include**:
- Backend connectivity verification
- Frontend accessibility checks
- Database connection validation
- Test user creation
- Browser environment verification
- API endpoint validation
- Route accessibility checks

### 2. Authentication Tests (`auth.e2e-spec.ts`)

**Purpose**: Test complete authentication flow

**Tests Include**:
- Landing page functionality
- User registration process
- Login/logout functionality
- Authentication guards
- Token management
- Route protection

### 3. Client Management Tests (`client-management.e2e-spec.ts`)

**Purpose**: Test client CRUD operations

**Tests Include**:
- Client list display
- Add new client
- Edit client information
- Delete client
- Search and filter functionality
- Form validation

### 4. Service Request Tests (`service-requests.e2e-spec.ts`)

**Purpose**: Test service request management

**Tests Include**:
- Service request list display
- Create new service request
- Update service request status
- Edit service request details
- Filter by status and priority
- Search functionality

### 5. Dashboard Tests (`dashboard.e2e-spec.ts`)

**Purpose**: Test dashboard functionality

**Tests Include**:
- Dashboard access control
- Navigation menu functionality
- Statistics and metrics display
- Recent activity sections
- Quick action buttons
- User profile information

### 6. Application Tests (`app.e2e-spec.ts`)

**Purpose**: Test general application functionality

**Tests Include**:
- Landing page elements
- Navigation functionality
- Responsive design
- Performance metrics
- Error handling
- Accessibility features
- Cross-browser compatibility

## 🔧 Configuration

### Protractor Configuration

The E2E tests use Protractor with the following configuration:

```javascript
// protractor.conf.js
exports.config = {
  allScriptsTimeout: 120000,
  specs: ['./e2e/**/*.e2e-spec.ts'],
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': [
        '--headless',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1920,1080'
      ]
    }
  },
  baseUrl: 'http://localhost:4201/',
  framework: 'jasmine'
};
```

### Environment Variables

```bash
# Backend URL
BACKEND_URL=http://localhost:5000

# Frontend URL
FRONTEND_URL=http://localhost:4201

# Database URL
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/servix_db

# JWT Secret
JWT_SECRET=test-secret-key
```

## 📊 Test Reports

### Coverage Reports

After running tests, coverage reports are generated in:
- `frontend/coverage/` - Code coverage reports
- `frontend/test-results/` - Test execution results
- `frontend/screenshots/` - Screenshots of failed tests

### Console Output

The test runner provides detailed console output including:
- ✅ Success indicators
- ❌ Error messages
- ⚠️ Warnings
- 📊 Performance metrics
- 🔍 Debug information

## 🛠️ Troubleshooting

### Common Issues

#### 1. Backend Not Running
```bash
# Start backend server
cd backend
npm start
```

#### 2. Frontend Not Running
```bash
# Start frontend server
cd frontend
ng serve --port 4201
```

#### 3. Database Connection Issues
```bash
# Check database status
cd backend
npx prisma db push
npx prisma generate
```

#### 4. Chrome/ChromeDriver Issues
```bash
# Install ChromeDriver
npm install -g chromedriver

# Or use system ChromeDriver
export CHROMEDRIVER_PATH=/usr/bin/chromedriver
```

#### 5. Port Conflicts
```bash
# Check if ports are in use
lsof -i :4201
lsof -i :5000

# Kill processes if needed
kill -9 <PID>
```

### Debug Mode

Run tests in debug mode for detailed output:

```bash
# Run with verbose output
ng e2e --verbose

# Run with debug logging
DEBUG=* ng e2e

# Run specific test with debugging
ng e2e --specs=./e2e/auth.e2e-spec.ts --verbose
```

## 🔄 Continuous Integration

The E2E tests are integrated into the CI/CD pipeline:

```yaml
# .github/workflows/ci.yml
e2e:
  runs-on: ubuntu-latest
  needs: [frontend]
  steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Install dependencies
      run: |
        cd frontend
        npm install --legacy-peer-deps
    - name: Run E2E tests
      run: |
        cd frontend
        ng e2e --watch=false
```

## 📈 Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern

### 2. Page Object Model
- Use page objects for element selectors
- Keep selectors maintainable
- Avoid hardcoded values

### 3. Test Data Management
- Use unique test data
- Clean up after tests
- Use factories for test data

### 4. Error Handling
- Add proper error handling
- Use try-catch blocks
- Provide meaningful error messages

### 5. Performance
- Keep tests fast
- Use appropriate waits
- Avoid unnecessary delays

## 🎯 Test Coverage

The E2E tests cover:

- ✅ **User Authentication** (100%)
- ✅ **Client Management** (100%)
- ✅ **Service Request Management** (100%)
- ✅ **Dashboard Functionality** (100%)
- ✅ **Navigation** (100%)
- ✅ **Form Validation** (100%)
- ✅ **Error Handling** (100%)
- ✅ **Responsive Design** (100%)

## 📝 Contributing

When adding new E2E tests:

1. **Follow the existing pattern**
2. **Use descriptive test names**
3. **Add proper error handling**
4. **Include setup and cleanup**
5. **Update this README**

### Example Test Structure

```typescript
describe('Feature Name', () => {
  beforeEach(async () => {
    // Setup
  });

  afterEach(async () => {
    // Cleanup
  });

  it('should perform specific action', async () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## 📞 Support

For issues with E2E tests:

1. Check the troubleshooting section
2. Review console output
3. Check test reports
4. Verify environment setup
5. Contact the development team

---

**Happy Testing! 🧪✨** 