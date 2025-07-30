# CRM App - Postman CLI Testing

This directory contains Postman CLI (Newman) setup for automated API testing of the CRM application.

## 📁 File Structure

```
postman/
├── CRM-App-API.postman_collection.json    # Main API collection
├── CRM-App-Develop.postman_environment.json # Development environment
├── test-scripts.js                        # Test scripts and configurations
├── package.json                           # Newman dependencies and scripts
└── README.md                             # This file
```

## 🚀 Quick Start

### 1. Install Newman (Postman CLI)

```bash
# Install Newman globally
npm install -g newman

# Or install locally in this directory
cd postman
npm install
```

### 2. Start Your Backend Server

Make sure your backend server is running on `http://localhost:5000`:

```bash
cd backend
npm run dev
```

### 3. Run Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:auth
npm run test:companies
npm run test:clients
npm run test:service-requests
npm run test:admin

# Run with verbose output
npm run test:verbose

# Run with multiple iterations
npm run test:iteration
```

## 📋 API Endpoints Covered

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/profile` - Get user profile

### Companies
- `GET /api/companies` - Get all companies

### Clients
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Service Requests
- `GET /api/service-requests` - Get all service requests
- `GET /api/service-requests?companyId=X` - Get service requests by company
- `POST /api/service-requests` - Create new service request

### Admin
- `GET /api/admin/users` - Get all users (Admin only)
- `DELETE /api/admin/users/:id` - Delete user (Admin only)

## 🔧 Environment Variables

The development environment includes these variables:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `baseUrl` | API base URL | `http://localhost:5000` |
| `authToken` | JWT authentication token | (auto-populated) |
| `companyId` | Company ID for testing | `1` |
| `userEmail` | Test user email | `admin@servix.com` |
| `userPassword` | Test user password | `password123` |
| `userFirstName` | Test user first name | `Admin` |
| `userLastName` | Test user last name | `User` |
| `userRole` | Test user role | `Admin` |
| `clientName` | Test client name | `Test Client` |
| `clientEmail` | Test client email | `client@example.com` |
| `clientPhone` | Test client phone | `+1234567890` |
| `clientCompany` | Test client company | `Test Company` |
| `clientId` | Test client ID | `1` |
| `serviceRequestTitle` | Test service request title | `Test Service Request` |
| `serviceRequestDescription` | Test service request description | `This is a test service request description` |
| `serviceRequestPriority` | Test service request priority | `Medium` |
| `serviceRequestStatus` | Test service request status | `Open` |
| `userId` | Test user ID | `1` |

## 🧪 Test Scripts

The collection includes comprehensive test scripts that:

- ✅ Validate response status codes
- ✅ Check response structure and data types
- ✅ Verify authentication and authorization
- ✅ Test error handling
- ✅ Measure response times
- ✅ Auto-populate environment variables

### Global Tests
Every request includes these global tests:
- Status code validation (200, 201, 204)
- Response time check (< 2000ms)
- Content-type header validation

### Authentication Tests
- Login success with token extraction
- Registration validation
- Profile retrieval verification

### Data Validation Tests
- Array responses for list endpoints
- Required field presence
- Data type validation

## 📊 Test Reports

### JSON Report
```bash
npm test
# Generates: test-results.json
```

### HTML Report
```bash
npm run generate:html
# Generates: test-report.html
```

### Verbose Output
```bash
npm run test:verbose
# Shows detailed request/response information
```

## 🔄 Workflow Examples

### 1. Complete API Testing Workflow
```bash
# 1. Start backend server
cd backend && npm run dev

# 2. Run all tests
cd postman && npm test

# 3. Generate HTML report
npm run generate:html
```

### 2. Authentication Testing
```bash
# Test only authentication endpoints
npm run test:auth
```

### 3. Load Testing
```bash
# Run tests with 3 iterations and 1-second delays
npm run test:iteration
```

### 4. Development Testing
```bash
# Run with verbose output for debugging
npm run test:verbose
```

## 🛠️ Customization

### Adding New Tests
1. Add new requests to `CRM-App-API.postman_collection.json`
2. Add test scripts to `test-scripts.js`
3. Update environment variables in `CRM-App-Develop.postman_environment.json`

### Environment-Specific Testing
Create new environment files for different environments:
- `CRM-App-Staging.postman_environment.json`
- `CRM-App-Production.postman_environment.json`

### Custom Test Scripts
Add custom test logic to `test-scripts.js`:

```javascript
// Example: Custom validation
pm.test("Custom business logic", function () {
  const response = pm.response.json();
  pm.expect(response.data).to.have.length.above(0);
});
```

## 🐛 Troubleshooting

### Common Issues

1. **Server not running**
   ```bash
   # Ensure backend is running on port 5000
   cd backend && npm run dev
   ```

2. **Authentication failures**
   - Check if `authToken` is properly set
   - Verify JWT_SECRET in backend environment

3. **Database connection issues**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in backend environment

4. **Newman not found**
   ```bash
   npm install -g newman
   # or
   npm install
   ```

### Debug Mode
```bash
# Run with maximum verbosity
newman run ./CRM-App-API.postman_collection.json \
  -e ./CRM-App-Develop.postman_environment.json \
  --verbose \
  --reporters cli,json \
  --reporter-json-export ./debug-results.json
```

## 📈 CI/CD Integration

The API tests are now fully integrated into the GitHub Actions CI/CD pipeline! 

### GitHub Actions Integration
The workflow automatically runs API tests on every push and pull request to `main` and `develop` branches.

**Job Structure:**
```
backend → api-tests → frontend → build
```

**Features:**
- ✅ **Automatic Testing** - Runs on every code change
- ✅ **Database Setup** - Fresh PostgreSQL container for each run
- ✅ **Test Reports** - JSON and HTML reports uploaded as artifacts
- ✅ **Dependency Caching** - Fast installation with npm cache
- ✅ **Parallel Execution** - Optimized for speed

### Manual Workflow Trigger
You can also run the workflow manually:
1. Go to GitHub repository → Actions tab
2. Select "CI" workflow
3. Click "Run workflow"
4. Select branch and run

### Test Results
- **GitHub Actions Dashboard** - Real-time test execution
- **Artifacts** - Download test reports from Actions tab
- **Notifications** - Get notified of test failures

### Local CI/CD Testing
To test the CI/CD setup locally:

```bash
# Start PostgreSQL (same as GitHub Actions)
docker run --name postgres-test \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=servix_db \
  -p 5433:5432 \
  -d postgres:latest

# Setup backend (same as CI)
cd backend
npm ci
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm start &

# Run tests (same as CI)
cd postman
npm test
```

### Jenkins Pipeline Example
```groovy
stage('API Tests') {
  steps {
    dir('postman') {
      sh 'npm install'
      sh 'npm test'
    }
  }
}
```

📖 **For detailed CI/CD documentation, see [CI-CD-INTEGRATION.md](./CI-CD-INTEGRATION.md)**

## 📚 Additional Resources

- [Newman Documentation](https://learning.postman.com/docs/running-collections/using-newman-cli/)
- [Postman Collection Format](https://learning.postman.com/docs/collections/)
- [Postman Environment Variables](https://learning.postman.com/docs/sending-requests/variables/)

## 🤝 Contributing

1. Add new endpoints to the collection
2. Update test scripts for new functionality
3. Add environment variables as needed
4. Update this README with new features

---

**Happy Testing! 🚀** 