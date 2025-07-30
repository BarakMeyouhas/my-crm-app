// Postman CLI Test Scripts for CRM App
// These scripts can be used with Postman CLI for automated testing

const testScripts = {
  // Authentication Tests
  loginTest: `
    pm.test("Login successful", function () {
      pm.response.to.have.status(200);
      const responseJson = pm.response.json();
      pm.expect(responseJson).to.have.property('token');
      pm.expect(responseJson).to.have.property('role');
      
      // Store the token for subsequent requests
      if (responseJson.token) {
        pm.environment.set("authToken", responseJson.token);
      }
    });
  `,

  registerTest: `
    pm.test("Registration successful", function () {
      pm.response.to.have.status(201);
      const responseJson = pm.response.json();
      pm.expect(responseJson).to.have.property('message');
      pm.expect(responseJson.message).to.equal('User registered successfully');
    });
  `,

  profileTest: `
    pm.test("Profile retrieved successfully", function () {
      pm.response.to.have.status(200);
      const responseJson = pm.response.json();
      pm.expect(responseJson).to.have.property('email');
      pm.expect(responseJson).to.have.property('role');
      pm.expect(responseJson).to.have.property('firstName');
      pm.expect(responseJson).to.have.property('lastName');
    });
  `,

  // Companies Tests
  companiesTest: `
    pm.test("Companies retrieved successfully", function () {
      pm.response.to.have.status(200);
      const responseJson = pm.response.json();
      pm.expect(responseJson).to.be.an('array');
      
      // Store first company ID for other tests
      if (responseJson.length > 0) {
        pm.environment.set("companyId", responseJson[0].id);
      }
    });
  `,

  // Clients Tests
  clientsGetTest: `
    pm.test("Clients retrieved successfully", function () {
      pm.response.to.have.status(200);
      const responseJson = pm.response.json();
      pm.expect(responseJson).to.be.an('array');
    });
  `,

  clientCreateTest: `
    pm.test("Client created successfully", function () {
      pm.response.to.have.status(201);
      const responseJson = pm.response.json();
      pm.expect(responseJson).to.have.property('id');
      pm.expect(responseJson).to.have.property('name');
      
      // Store client ID for update/delete tests
      if (responseJson.id) {
        pm.environment.set("clientId", responseJson.id);
      }
    });
  `,

  clientUpdateTest: `
    pm.test("Client updated successfully", function () {
      pm.response.to.have.status(200);
      const responseJson = pm.response.json();
      pm.expect(responseJson).to.have.property('id');
      pm.expect(responseJson).to.have.property('name');
    });
  `,

  clientDeleteTest: `
    pm.test("Client deleted successfully", function () {
      pm.response.to.have.status(200);
    });
  `,

  // Service Requests Tests
  serviceRequestsGetTest: `
    pm.test("Service requests retrieved successfully", function () {
      pm.response.to.have.status(200);
      const responseJson = pm.response.json();
      pm.expect(responseJson).to.be.an('array');
    });
  `,

  serviceRequestCreateTest: `
    pm.test("Service request created successfully", function () {
      pm.response.to.have.status(201);
      const responseJson = pm.response.json();
      pm.expect(responseJson).to.have.property('id');
      pm.expect(responseJson).to.have.property('title');
    });
  `,

  // Admin Tests
  adminUsersTest: `
    pm.test("Admin users retrieved successfully", function () {
      pm.response.to.have.status(200);
      const responseJson = pm.response.json();
      pm.expect(responseJson).to.be.an('array');
    });
  `,

  adminDeleteUserTest: `
    pm.test("User deleted successfully", function () {
      pm.response.to.have.status(204);
    });
  `,

  // Global Tests
  globalTests: `
    pm.test("Status code is valid", function () {
      pm.expect(pm.response.code).to.be.oneOf([200, 201, 204]);
    });

    pm.test("Response time is acceptable", function () {
      pm.expect(pm.response.responseTime).to.be.below(2000);
    });

    pm.test("Response has content-type header", function () {
      pm.expect(pm.response.headers).to.have.property('content-type');
    });
  `,

  // Error Tests
  unauthorizedTest: `
    pm.test("Unauthorized access blocked", function () {
      pm.response.to.have.status(401);
    });
  `,

  forbiddenTest: `
    pm.test("Forbidden access blocked", function () {
      pm.response.to.have.status(403);
    });
  `,

  notFoundTest: `
    pm.test("Resource not found", function () {
      pm.response.to.have.status(404);
    });
  `,

  badRequestTest: `
    pm.test("Bad request handled", function () {
      pm.response.to.have.status(400);
    });
  `
};

// Pre-request scripts for setting up requests
const preRequestScripts = {
  // Set auth token for authenticated requests
  setAuthToken: `
    const authToken = pm.environment.get("authToken");
    if (authToken) {
      pm.request.headers.add({
        key: "Authorization",
        value: "Bearer " + authToken
      });
    }
  `,

  // Generate random data for testing
  generateRandomData: `
    const randomId = Math.floor(Math.random() * 10000);
    const randomEmail = "test" + randomId + "@example.com";
    
    pm.environment.set("randomId", randomId);
    pm.environment.set("randomEmail", randomEmail);
  `,

  // Set dynamic timestamps
  setTimestamp: `
    const timestamp = new Date().toISOString();
    pm.environment.set("timestamp", timestamp);
  `
};

// Newman configuration for CLI testing
const newmanConfig = {
  collection: './postman/CRM-App-API.postman_collection.json',
  environment: './postman/CRM-App-Develop.postman_environment.json',
  reporters: ['cli', 'json'],
  reporter: {
    json: {
      export: './postman/test-results.json'
    }
  },
  iterationCount: 1,
  delayRequest: 1000,
  timeout: 5000,
  insecure: true,
  ignoreRedirects: true,
  verbose: true
};

// Export for use with Postman CLI
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testScripts,
    preRequestScripts,
    newmanConfig
  };
}

// For browser/Postman use
if (typeof window !== 'undefined') {
  window.PostmanTestScripts = {
    testScripts,
    preRequestScripts
  };
} 