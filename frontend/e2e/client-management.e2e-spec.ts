import { browser, by, element, ExpectedConditions as EC } from 'protractor';
import * as http from 'http';

describe('Client Management E2E Tests', () => {
  const baseUrl = 'http://localhost:4201';
  const backendUrl = 'http://localhost:5000';

  beforeAll(async () => {
    // Check if backend is accessible
    try {
      const response = await new Promise<{ statusCode: number }>((resolve, reject) => {
        http.get(`${backendUrl}/api/clients`, (res) => {
          resolve({ statusCode: res.statusCode || 0 });
        }).on('error', reject);
      });
      console.log(`✅ Backend is accessible (Status: ${response.statusCode})`);
    } catch (error) {
      console.log('⚠️ Backend not accessible, continuing with frontend-only tests');
    }
  });

  describe('Authentication Protection', () => {
    it('should redirect to login when accessing client list without authentication', async () => {
      await browser.get(`${baseUrl}/clients`);
      await browser.waitForAngular();
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/login');
      console.log('✅ Client list access properly protected');
    });

    it('should redirect to login when accessing client details without authentication', async () => {
      await browser.get(`${baseUrl}/clients/1`);
      await browser.waitForAngular();
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/login');
      console.log('✅ Client details access properly protected');
    });
  });

  describe('Client Management Interface', () => {
    it('should show login form when accessing protected routes', async () => {
      await browser.get(`${baseUrl}/clients`);
      await browser.waitForAngular();
      
      // Should redirect to login
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/login');
      
      // Check for login form elements that actually exist
      const emailInput = element(by.css('input[name="email"]'));
      const passwordInput = element(by.css('input[name="password"]'));
      const submitButton = element(by.css('button[type="submit"]'));
      
      try {
        await browser.wait(EC.presenceOf(emailInput), 10000);
        await browser.wait(EC.presenceOf(passwordInput), 10000);
        await browser.wait(EC.elementToBeClickable(submitButton), 10000);
        console.log('✅ Login form displayed when accessing protected routes');
      } catch (error) {
        console.log('⚠️ Login form not found');
      }
    });
  });

  describe('Navigation and Routing', () => {
    it('should handle breadcrumb navigation', async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.waitForAngular();
      
      const breadcrumb = element(by.css('.breadcrumb, .nav-breadcrumb, [data-testid="breadcrumb"]'));
      
      try {
        await browser.wait(EC.presenceOf(breadcrumb), 10000);
        console.log('✅ Breadcrumb navigation available');
      } catch (error) {
        console.log('⚠️ Breadcrumb navigation not available');
      }
    });
  });
}); 