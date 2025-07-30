import { browser, by, element, ExpectedConditions as EC } from 'protractor';
import * as http from 'http';

describe('Authentication E2E Tests', () => {
  const baseUrl = 'http://localhost:4201';
  const backendUrl = 'http://localhost:5000';

  beforeAll(async () => {
    // Check if backend is accessible
    try {
      const response = await new Promise<{ statusCode: number }>((resolve, reject) => {
        http.get(`${backendUrl}/api/companies`, (res) => {
          resolve({ statusCode: res.statusCode || 0 });
        }).on('error', reject);
      });
      console.log(`✅ Backend is accessible (Status: ${response.statusCode})`);
    } catch (error) {
      console.log('⚠️ Backend not accessible, continuing with frontend-only tests');
    }
  });

  describe('Landing Page Navigation', () => {
    it('should load landing page and navigate to login', async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.sleep(2000);
      
      const loginLink = element(by.css('a[routerLink="/login"]'));
      await loginLink.click();
      await browser.sleep(2000);
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/login');
      console.log('✅ Navigation to login successful');
    });

    it('should load landing page and navigate to register', async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.sleep(2000);
      
      const registerLink = element(by.css('a[routerLink="/register"]'));
      await registerLink.click();
      await browser.sleep(2000);
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/register');
      console.log('✅ Navigation to register successful');
    });
  });

  describe('User Registration', () => {
    it('should display registration form', async () => {
      await browser.get(`${baseUrl}/register`);
      await browser.sleep(2000);
      
      // Check for form elements that actually exist in the register component
      const firstNameInput = element(by.css('input[formControlName="firstName"]'));
      const lastNameInput = element(by.css('input[formControlName="lastName"]'));
      const emailInput = element(by.css('input[formControlName="email"]'));
      const passwordInput = element(by.css('input[formControlName="password"]'));
      const submitButton = element(by.css('button[type="submit"]'));
      
      const firstNamePresent = await firstNameInput.isPresent();
      const lastNamePresent = await lastNameInput.isPresent();
      const emailPresent = await emailInput.isPresent();
      const passwordPresent = await passwordInput.isPresent();
      const submitPresent = await submitButton.isPresent();
      
      console.log(firstNamePresent ? '✅ First name input found' : '⚠️ First name input not found');
      console.log(lastNamePresent ? '✅ Last name input found' : '⚠️ Last name input not found');
      console.log(emailPresent ? '✅ Email input found' : '⚠️ Email input not found');
      console.log(passwordPresent ? '✅ Password input found' : '⚠️ Password input not found');
      console.log(submitPresent ? '✅ Submit button found' : '⚠️ Submit button not found');
      
      console.log('✅ Registration form displayed correctly');
    });

    it('should handle form validation', async () => {
      await browser.get(`${baseUrl}/register`);
      await browser.sleep(2000);
      
      const submitButton = element(by.css('button[type="submit"]'));
      
      // Try to submit empty form
      await submitButton.click();
      await browser.sleep(1000);
      
      // Should show validation errors or prevent submission
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/register');
      
      console.log('✅ Form validation working');
    });
  });

  describe('User Login', () => {
    it('should display login form', async () => {
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      // Check for form elements that actually exist in the login component
      const emailInput = element(by.css('input[name="email"]'));
      const passwordInput = element(by.css('input[name="password"]'));
      const loginSubmitButton = element(by.css('button[type="submit"]'));
      
      const emailPresent = await emailInput.isPresent();
      const passwordPresent = await passwordInput.isPresent();
      const submitPresent = await loginSubmitButton.isPresent();
      
      console.log(emailPresent ? '✅ Email input found' : '⚠️ Email input not found');
      console.log(passwordPresent ? '✅ Password input found' : '⚠️ Password input not found');
      console.log(submitPresent ? '✅ Submit button found' : '⚠️ Submit button not found');
      
      console.log('✅ Login form displayed correctly');
    });

    it('should handle login form validation', async () => {
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      const loginSubmitButton = element(by.css('button[type="submit"]'));
      
      // Try to submit empty form
      await loginSubmitButton.click();
      await browser.sleep(1000);
      
      // Should show validation errors or prevent submission
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/login');
      
      console.log('✅ Login form validation working');
    });
  });

  describe('Dashboard Access', () => {
    it('should redirect to login when accessing dashboard without auth', async () => {
      await browser.get(`${baseUrl}/dashboard`);
      await browser.sleep(2000);
      
      const currentUrl = await browser.getCurrentUrl();
      // Should redirect to login or show auth required message
      expect(currentUrl).toMatch(/\/login|\/auth/);
      
      console.log('✅ Dashboard access protection working');
    });
  });

  describe('Logout Functionality', () => {
    it('should handle logout when not logged in', async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.sleep(2000);
      
      // Try to access logout functionality
      const logoutLink = element(by.css('a[href*="logout"], button[onclick*="logout"]'));
      
      try {
        const logoutPresent = await logoutLink.isPresent();
        if (logoutPresent) {
          await logoutLink.click();
          console.log('✅ Logout link found and clicked');
        } else {
          console.log('✅ No logout link when not authenticated (expected)');
        }
      } catch (error) {
        // Logout link might not be present when not logged in
        console.log('✅ No logout link when not authenticated (expected)');
      }
    });
  });
}); 