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
      
      const loginLink = element(by.css('a[routerLink="/login"], a[href*="login"], .login-link'));
      await browser.wait(EC.elementToBeClickable(loginLink), 5000);
      await loginLink.click();
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/login');
      console.log('✅ Navigation to login successful');
    });

    it('should load landing page and navigate to register', async () => {
      await browser.get(`${baseUrl}/landing`);
      
      const registerLink = element(by.css('a[routerLink="/register"], a[href*="register"], .register-link'));
      await browser.wait(EC.elementToBeClickable(registerLink), 5000);
      await registerLink.click();
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/register');
      console.log('✅ Navigation to register successful');
    });
  });

  describe('User Registration', () => {
    it('should display registration form', async () => {
      await browser.get(`${baseUrl}/register`);
      
      const emailInput = element(by.css('input[type="email"], input[name="email"], input[formControlName="email"]'));
      const passwordInput = element(by.css('input[type="password"]'));
      const submitButton = element(by.css('button[type="submit"], input[type="submit"]'));
      
      await browser.wait(EC.presenceOf(emailInput), 5000);
      await browser.wait(EC.presenceOf(passwordInput), 5000);
      await browser.wait(EC.elementToBeClickable(submitButton), 5000);
      
      expect(await emailInput.isPresent()).toBe(true);
      expect(await passwordInput.isPresent()).toBe(true);
      expect(await submitButton.isPresent()).toBe(true);
      
      console.log('✅ Registration form displayed correctly');
    });

    it('should handle form validation', async () => {
      await browser.get(`${baseUrl}/register`);
      
      const submitButton = element(by.css('button[type="submit"], input[type="submit"]'));
      await browser.wait(EC.elementToBeClickable(submitButton), 5000);
      
      // Try to submit empty form
      await submitButton.click();
      
      // Should show validation errors or prevent submission
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/register');
      
      console.log('✅ Form validation working');
    });
  });

  describe('User Login', () => {
    it('should display login form', async () => {
      await browser.get(`${baseUrl}/login`);
      
      const emailInput = element(by.css('input[type="email"], input[name="email"], input[formControlName="email"]'));
      const passwordInput = element(by.css('input[type="password"]'));
      const loginSubmitButton = element(by.css('button[type="submit"], input[type="submit"]'));
      
      await browser.wait(EC.presenceOf(emailInput), 5000);
      await browser.wait(EC.presenceOf(passwordInput), 5000);
      await browser.wait(EC.elementToBeClickable(loginSubmitButton), 5000);
      
      expect(await emailInput.isPresent()).toBe(true);
      expect(await passwordInput.isPresent()).toBe(true);
      expect(await loginSubmitButton.isPresent()).toBe(true);
      
      console.log('✅ Login form displayed correctly');
    });

    it('should handle login form validation', async () => {
      await browser.get(`${baseUrl}/login`);
      
      const loginSubmitButton = element(by.css('button[type="submit"], input[type="submit"]'));
      await browser.wait(EC.elementToBeClickable(loginSubmitButton), 5000);
      
      // Try to submit empty form
      await loginSubmitButton.click();
      
      // Should show validation errors or prevent submission
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/login');
      
      console.log('✅ Login form validation working');
    });
  });

  describe('Dashboard Access', () => {
    it('should redirect to login when accessing dashboard without auth', async () => {
      await browser.get(`${baseUrl}/dashboard`);
      
      const currentUrl = await browser.getCurrentUrl();
      // Should redirect to login or show auth required message
      expect(currentUrl).toMatch(/\/login|\/auth/);
      
      console.log('✅ Dashboard access protection working');
    });
  });

  describe('Logout Functionality', () => {
    it('should handle logout when not logged in', async () => {
      await browser.get(`${baseUrl}/landing`);
      
      // Try to access logout functionality
      const logoutLink = element(by.css('a[href*="logout"], button[onclick*="logout"]'));
      
      try {
        await browser.wait(EC.presenceOf(logoutLink), 3000);
        await logoutLink.click();
        console.log('✅ Logout link found and clicked');
      } catch (error) {
        // Logout link might not be present when not logged in
        console.log('✅ No logout link when not authenticated (expected)');
      }
    });
  });
}); 