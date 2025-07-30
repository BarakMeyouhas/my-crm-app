# CI/CD Integration with GitHub Actions

This document explains how the Postman CLI tests are integrated into the GitHub Actions CI/CD pipeline.

## 🚀 Overview

The API tests are now fully integrated into the GitHub Actions workflow and will run automatically on every push and pull request to the `main` and `develop` branches.

## 📋 Workflow Structure

### Job Dependencies
```
backend → api-tests → frontend → build
```

1. **Backend Tests** - Run first (database setup, unit tests)
2. **API Tests** - Run after backend (Postman CLI tests)
3. **Frontend Tests** - Run after API tests
4. **Build** - Run after all tests pass

## 🔧 API Tests Job Details

### Environment Setup
- **OS**: Ubuntu Latest
- **Node.js**: 18.x
- **Database**: PostgreSQL (Docker container)
- **Backend**: Express.js server
- **Testing**: Newman (Postman CLI)

### Steps Executed

1. **Checkout Code**
   ```yaml
   - uses: actions/checkout@v4
   ```

2. **Setup Node.js**
   ```yaml
   - name: Setup Node.js
     uses: actions/setup-node@v3
     with:
       node-version: '18'
   ```

3. **Cache Dependencies**
   ```yaml
   - name: Cache postman dependencies
     uses: actions/cache@v4
     with:
       path: postman/node_modules
       key: ${{ runner.os }}-postman-node-${{ hashFiles('postman/package-lock.json') }}
   ```

4. **Install Newman**
   ```bash
   npm install -g newman
   npm install -g newman-reporter-html
   ```

5. **Install Postman Dependencies**
   ```bash
   cd postman
   npm install
   ```

6. **Setup Backend**
   ```bash
   cd backend
   npm ci
   npx prisma generate
   npx prisma migrate deploy
   npx prisma db seed
   ```

7. **Start Backend Server**
   ```bash
   npm start &
   # Wait for server to be ready
   ```

8. **Run API Tests**
   ```bash
   newman run ./CRM-App-API.postman_collection.json \
     -e ./github-actions-environment.json \
     --reporters cli,json,html \
     --reporter-json-export ./test-results.json \
     --reporter-html-export ./test-report.html \
     --verbose
   ```

9. **Upload Test Results**
   ```yaml
   - name: Upload API test results
     uses: actions/upload-artifact@v4
     if: always()
     with:
       name: api-test-results
       path: |
         postman/test-results.json
         postman/test-report.html
   ```

## 📊 Test Reports

### Generated Reports
- **JSON Report**: `test-results.json` - Machine-readable test results
- **HTML Report**: `test-report.html` - Human-readable test report
- **CLI Output**: Real-time test execution logs

### Artifacts
Test results are uploaded as GitHub Actions artifacts and can be downloaded from the Actions tab.

## 🔍 Monitoring

### GitHub Actions Dashboard
1. Go to your repository
2. Click on "Actions" tab
3. Select the workflow run
4. View the "API Tests (Postman CLI)" job

### Test Results
- ✅ **Passed**: All API endpoints working correctly
- ❌ **Failed**: API issues detected
- ⚠️ **Skipped**: Tests that couldn't run due to setup issues

## 🛠️ Configuration

### Environment Variables
The GitHub Actions environment uses these key variables:

| Variable | Value | Purpose |
|----------|-------|---------|
| `baseUrl` | `http://localhost:5000` | Backend server URL |
| `userEmail` | `admin1@technova.com` | Test user email |
| `userPassword` | `hashedpassword` | Test user password |
| `companyId` | `1` | Test company ID |

### Database Setup
- **Database**: PostgreSQL
- **Host**: localhost:5433
- **Database**: servix_db
- **User**: postgres
- **Password**: postgres

## 🔄 Workflow Triggers

### Automatic Triggers
- **Push** to `main` branch
- **Push** to `develop` branch
- **Pull Request** to `main` branch
- **Pull Request** to `develop` branch

### Manual Triggers
You can also run the workflow manually:
1. Go to Actions tab
2. Select "CI" workflow
3. Click "Run workflow"
4. Select branch and run

## 📈 Performance Metrics

### Expected Performance
- **Total Duration**: ~2-3 minutes
- **API Tests**: ~30-60 seconds
- **Database Setup**: ~10-15 seconds
- **Server Startup**: ~10-15 seconds

### Optimization Features
- **Dependency Caching**: Reduces installation time
- **Parallel Jobs**: Backend and API tests run in parallel where possible
- **Efficient Database**: Uses Docker container for fast setup

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check if PostgreSQL is running
docker ps | grep postgres
```

#### 2. Backend Server Not Starting
```bash
# Check server logs
cd backend
npm start
```

#### 3. Newman Not Found
```bash
# Install Newman globally
npm install -g newman
```

#### 4. Test Failures
- Check if database is seeded properly
- Verify environment variables are correct
- Ensure backend server is running on port 5000

### Debug Mode
To run tests locally with the same setup:

```bash
# Start PostgreSQL
docker run --name postgres-test \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=servix_db \
  -p 5433:5432 \
  -d postgres:latest

# Setup backend
cd backend
npm ci
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm start &

# Run tests
cd postman
npm test
```

## 🔒 Security Considerations

### Environment Variables
- Sensitive data (passwords, tokens) are stored as secrets
- Database credentials are isolated to the test environment
- No production data is used in tests

### Test Data
- All test data is created fresh for each run
- Database is seeded with safe, non-production data
- Tests don't affect production systems

## 📝 Best Practices

### For Developers
1. **Run Tests Locally** before pushing
2. **Check Test Results** in GitHub Actions
3. **Fix API Issues** before merging
4. **Update Tests** when adding new endpoints

### For CI/CD
1. **Monitor Test Results** regularly
2. **Review Failed Tests** promptly
3. **Update Test Data** when schema changes
4. **Maintain Test Coverage** for new features

## 🚀 Future Enhancements

### Planned Improvements
1. **Performance Testing** - Add load testing scenarios
2. **Security Testing** - Add security-focused API tests
3. **Contract Testing** - Add API contract validation
4. **Coverage Reports** - Generate API coverage metrics
5. **Slack Notifications** - Send test results to Slack

### Customization Options
1. **Environment-Specific Tests** - Different tests for staging/production
2. **Scheduled Tests** - Run tests on a schedule
3. **Parallel Testing** - Run multiple test suites in parallel
4. **Test Data Management** - Better test data organization

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Newman Documentation](https://learning.postman.com/docs/running-collections/using-newman-cli/)
- [Postman Collection Format](https://learning.postman.com/docs/collections/)
- [Prisma Documentation](https://www.prisma.io/docs/)

---

**Happy Testing! 🚀** 