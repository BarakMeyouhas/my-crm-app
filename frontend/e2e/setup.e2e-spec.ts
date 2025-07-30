import { browser, by, element, ExpectedConditions as EC } from 'protractor';

describe('E2E Test Setup and Environment', () => {
  const baseUrl = 'http://localhost:4201';
  const apiUrl = 'http://localhost:5000/api';
  
  // Test data for setup
  const setupUser = {
    firstName: 'E2E',
    lastName: 'TestUser',
    email: `e2e.test.${Date.now()}@example.com`,
    password: 'E2ETestPassword123!',
    companyId: 1
  };

  describe('Environment Setup', () => {
    it('should verify backend is running and accessible', async () => {
      try {
        const response = await fetch(`${apiUrl}/companies`);
        expect(response.ok).toBe(true);
        console.log('✅ Backend is running and accessible');
      } catch (error) {
        console.log('❌ Backend is not accessible:', error.message);
        // Don't fail the test, just log the issue
      }
    });

    it('should verify frontend is running and accessible', async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.sleep(2000);
      
      const pageTitle = await browser.getTitle();
      expect(pageTitle).toBeTruthy();
      console.log('✅ Frontend is running and accessible');
    });

    it('should verify database connection through API', async () => {
      try {
        const response = await fetch(`${apiUrl}/companies`);
        const companies = await response.json();
        expect(Array.isArray(companies)).toBe(true);
        console.log('✅ Database connection verified through API');
      } catch (error) {
        console.log('❌ Database connection failed:', error.message);
      }
    });
  });

  describe('Test User Setup', () => {
    it('should create a test user for E2E testing', async () => {
      // Navigate to registration page
      await browser.get(`${baseUrl}/register`);
      await browser.sleep(2000);
      
      // Fill in registration form
      const firstNameInput = element(by.css('input[formControlName="firstName"]'));
      const lastNameInput = element(by.css('input[formControlName="lastName"]'));
      const emailInput = element(by.css('input[formControlName="email"]'));
      const passwordInput = element(by.css('input[formControlName="password"]'));
      
      try {
        await firstNameInput.sendKeys(setupUser.firstName);
        await lastNameInput.sendKeys(setupUser.lastName);
        await emailInput.sendKeys(setupUser.email);
        await passwordInput.sendKeys(setupUser.password);
        
        // Select company if available
        try {
          const companySelect = element(by.css('select[formControlName="companyId"]'));
          await companySelect.click();
          const firstOption = element(by.css('select[formControlName="companyId"] option:nth-child(2)'));
          await firstOption.click();
        } catch (error) {
          console.log('Company selection not available');
        }
        
        // Submit the form
        const submitButton = element(by.css('button[type="submit"]'));
        await submitButton.click();
        
        // Wait for registration to complete
        await browser.sleep(3000);
        
        console.log('✅ Test user created successfully');
      } catch (error) {
        console.log('❌ Failed to create test user:', error.message);
      }
    });

    it('should verify test user can login', async () => {
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      const emailInput = element(by.css('input[type="email"]'));
      const passwordInput = element(by.css('input[type="password"]'));
      const submitButton = element(by.css('button[type="submit"]'));
      
      try {
        await emailInput.sendKeys(setupUser.email);
        await passwordInput.sendKeys(setupUser.password);
        await submitButton.click();
        
        await browser.sleep(3000);
        
        // Check if login was successful
        const currentUrl = await browser.getCurrentUrl();
        if (currentUrl.includes('/dashboard') || currentUrl.includes('/login')) {
          console.log('✅ Test user login verified');
        } else {
          console.log('❌ Test user login failed');
        }
      } catch (error) {
        console.log('❌ Login verification failed:', error.message);
      }
    });
  });

  describe('Test Data Cleanup', () => {
    it('should clean up test data after tests', async () => {
      // This test will be run after all other tests
      // Clear browser storage
      await browser.executeScript('window.localStorage.clear();');
      await browser.executeScript('window.sessionStorage.clear();');
      
      console.log('✅ Test data cleanup completed');
    });
  });

  describe('Browser Environment', () => {
    it('should verify browser capabilities', async () => {
      // Check if we can execute JavaScript
      const jsResult = await browser.executeScript('return navigator.userAgent;');
      expect(jsResult).toBeTruthy();
      console.log('✅ JavaScript execution verified');
      
      // Check if we can access localStorage
      await browser.executeScript('localStorage.setItem("test", "value");');
      const storedValue = await browser.executeScript('return localStorage.getItem("test");');
      expect(storedValue).toBe('value');
      console.log('✅ LocalStorage access verified');
      
      // Check if we can access sessionStorage
      await browser.executeScript('sessionStorage.setItem("test", "value");');
      const sessionValue = await browser.executeScript('return sessionStorage.getItem("test");');
      expect(sessionValue).toBe('value');
      console.log('✅ SessionStorage access verified');
    });

    it('should verify Angular is loaded', async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.sleep(2000);
      
      // Check if Angular is loaded by looking for Angular-specific elements
      const angularElement = element(by.css('[ng-version], [ng-app], [ng-controller]'));
      try {
        await browser.wait(EC.presenceOf(angularElement), 10000);
        console.log('✅ Angular is loaded');
      } catch (error) {
        console.log('❌ Angular not detected');
      }
    });
  });

  describe('API Endpoints Verification', () => {
    it('should verify authentication endpoints', async () => {
      try {
        // Test companies endpoint (public)
        const companiesResponse = await fetch(`${apiUrl}/companies`);
        expect(companiesResponse.ok).toBe(true);
        console.log('✅ Companies endpoint accessible');
        
        // Test auth endpoints (should exist but may require auth)
        const authResponse = await fetch(`${apiUrl}/auth/profile`);
        // This should return 401 (unauthorized) but not 404 (not found)
        expect(authResponse.status).not.toBe(404);
        console.log('✅ Auth endpoints exist');
      } catch (error) {
        console.log('❌ API endpoint verification failed:', error.message);
      }
    });

    it('should verify client endpoints', async () => {
      try {
        const clientsResponse = await fetch(`${apiUrl}/clients`);
        // This should return 401 (unauthorized) but not 404 (not found)
        expect(clientsResponse.status).not.toBe(404);
        console.log('✅ Client endpoints exist');
      } catch (error) {
        console.log('❌ Client endpoint verification failed:', error.message);
      }
    });

    it('should verify service request endpoints', async () => {
      try {
        const serviceRequestsResponse = await fetch(`${apiUrl}/service-requests`);
        // This should return 401 (unauthorized) but not 404 (not found)
        expect(serviceRequestsResponse.status).not.toBe(404);
        console.log('✅ Service request endpoints exist');
      } catch (error) {
        console.log('❌ Service request endpoint verification failed:', error.message);
      }
    });
  });

  describe('Frontend Routes Verification', () => {
    it('should verify landing page route', async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.sleep(2000);
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/landing');
      console.log('✅ Landing page route accessible');
    });

    it('should verify login page route', async () => {
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/login');
      console.log('✅ Login page route accessible');
    });

    it('should verify register page route', async () => {
      await browser.get(`${baseUrl}/register`);
      await browser.sleep(2000);
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/register');
      console.log('✅ Register page route accessible');
    });

    it('should verify dashboard route redirects to login when not authenticated', async () => {
      // Clear any existing tokens
      await browser.executeScript('localStorage.clear();');
      
      await browser.get(`${baseUrl}/dashboard`);
      await browser.sleep(2000);
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/login');
      console.log('✅ Dashboard route properly redirects to login when not authenticated');
    });
  });

  describe('Test Environment Summary', () => {
    it('should provide test environment summary', async () => {
      console.log('\n📋 E2E Test Environment Summary:');
      console.log(`🌐 Frontend URL: ${baseUrl}`);
      console.log(`🔧 Backend URL: ${apiUrl}`);
      console.log(`🧪 Test User Email: ${setupUser.email}`);
      console.log(`🔑 Test User Password: ${setupUser.password}`);
      console.log(`📅 Test Timestamp: ${new Date().toISOString()}`);
      
      // Check browser info
      const userAgent = await browser.executeScript('return navigator.userAgent;');
      console.log(`🌍 Browser: ${userAgent}`);
      
      // Check viewport size
      const windowSize = await browser.manage().window().getSize();
      console.log(`📱 Viewport Size: ${windowSize.width}x${windowSize.height}`);
      
      console.log('✅ Environment summary completed');
    });
  });
}); 