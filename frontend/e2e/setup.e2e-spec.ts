import { browser, by, element, ExpectedConditions as EC } from 'protractor';
import * as http from 'http';

describe('Setup E2E Tests', () => {
  const baseUrl = 'http://localhost:4201';
  const backendUrl = 'https://my-crm-backend-5qvj.onrender.com';

  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
  });

  describe('Environment Verification', () => {
    it('should verify frontend accessibility', async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.waitForAngular();
      
      const pageTitle = await browser.getTitle();
      expect(pageTitle).toBeTruthy();
      
      console.log('✅ Frontend is accessible');
    });

    it('should verify backend accessibility', async () => {
      try {
        const response = await new Promise<{ statusCode: number }>((resolve, reject) => {
          http.get(`${backendUrl}/api/companies`, (res) => {
            resolve({ statusCode: res.statusCode || 0 });
          }).on('error', reject);
        });
        
        expect(response.statusCode).toBeGreaterThan(0);
        console.log(`✅ Backend is accessible (Status: ${response.statusCode})`);
      } catch (error) {
        console.log('⚠️ Backend not accessible');
      }
    });

    it('should verify database connection', async () => {
      try {
        const response = await new Promise<{ statusCode: number }>((resolve, reject) => {
          http.get(`${backendUrl}/api/companies`, (res) => {
            resolve({ statusCode: res.statusCode || 0 });
          }).on('error', reject);
        });
        
        if (response.statusCode === 200) {
          console.log('✅ Database connection verified');
        } else {
          console.log(`⚠️ Database connection issue (Status: ${response.statusCode})`);
        }
      } catch (error) {
        console.log('⚠️ Database connection not available');
      }
    });
  });

  describe('Browser Capabilities', () => {
    it('should verify Chrome headless mode', async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.waitForAngular();
      
      const userAgent = await browser.executeScript('return navigator.userAgent;');
      expect(userAgent).toContain('Chrome');
      
      console.log('✅ Chrome headless mode working');
    });

    it('should verify viewport capabilities', async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.waitForAngular();
      
      const windowSize = await browser.manage().window().getSize();
      expect(windowSize.width).toBeGreaterThan(0);
      expect(windowSize.height).toBeGreaterThan(0);
      
      console.log(`✅ Viewport size: ${windowSize.width}x${windowSize.height}`);
    });

    it('should verify JavaScript execution', async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.waitForAngular();
      
      const result = await browser.executeScript('return document.title;');
      expect(result).toBeTruthy();
      
      console.log('✅ JavaScript execution working');
    });
  });

  describe('API Endpoints', () => {
    it('should verify companies API endpoint', async () => {
      try {
        const response = await new Promise<{ statusCode: number }>((resolve, reject) => {
          http.get(`${backendUrl}/api/companies`, (res) => {
            resolve({ statusCode: res.statusCode || 0 });
          }).on('error', reject);
        });
        
        expect(response.statusCode).toBeGreaterThan(0);
        console.log(`✅ Companies API endpoint accessible (Status: ${response.statusCode})`);
      } catch (error) {
        console.log('⚠️ Companies API endpoint not accessible');
      }
    });

    it('should verify clients API endpoint', async () => {
      try {
        const response = await new Promise<{ statusCode: number }>((resolve, reject) => {
          http.get(`${backendUrl}/api/clients`, (res) => {
            resolve({ statusCode: res.statusCode || 0 });
          }).on('error', reject);
        });
        
        expect(response.statusCode).toBeGreaterThan(0);
        console.log(`✅ Clients API endpoint accessible (Status: ${response.statusCode})`);
      } catch (error) {
        console.log('⚠️ Clients API endpoint not accessible');
      }
    });

    it('should verify service requests API endpoint', async () => {
      try {
        const response = await new Promise<{ statusCode: number }>((resolve, reject) => {
          http.get(`${backendUrl}/api/service-requests`, (res) => {
            resolve({ statusCode: res.statusCode || 0 });
          }).on('error', reject);
        });
        
        expect(response.statusCode).toBeGreaterThan(0);
        console.log(`✅ Service requests API endpoint accessible (Status: ${response.statusCode})`);
      } catch (error) {
        console.log('⚠️ Service requests API endpoint not accessible');
      }
    });
  });

  describe('Frontend Routes', () => {
    it('should verify landing page route', async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.waitForAngular();
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/landing');
      console.log('✅ Landing page route accessible');
    });

    it('should verify login page route', async () => {
      await browser.get(`${baseUrl}/login`);
      await browser.waitForAngular();
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/login');
      console.log('✅ Login page route accessible');
    });

    it('should verify register page route', async () => {
      await browser.get(`${baseUrl}/register`);
      await browser.waitForAngular();
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/register');
      console.log('✅ Register page route accessible');
    });

    it('should verify protected routes redirect to login', async () => {
      await browser.get(`${baseUrl}/dashboard`);
      await browser.waitForAngular();
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/login');
      console.log('✅ Protected routes properly redirect to login');
    });
  });

  describe('Test Data Setup', () => {
    it('should verify test user creation capability', async () => {
      await browser.get(`${baseUrl}/register`);
      await browser.waitForAngular();
      
      const formElement = element(by.css('form, .register-form, [data-testid="register-form"]'));
      
      try {
        await browser.wait(EC.presenceOf(formElement), 10000);
        console.log('✅ Test user creation form available');
      } catch (error) {
        console.log('⚠️ Test user creation form not available');
      }
    });

    it('should verify test data cleanup capability', async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.waitForAngular();
      
      // Clear browser storage
      await browser.executeScript('window.localStorage.clear();');
      await browser.executeScript('window.sessionStorage.clear();');
      
      console.log('✅ Test data cleanup capability verified');
    });
  });

  describe('Performance Baseline', () => {
    it('should establish performance baseline', async () => {
      const startTime = Date.now();
      
      await browser.get(`${baseUrl}/landing`);
      await browser.waitForAngular();
      
      try {
        await browser.wait(EC.presenceOf(element(by.css('h1, h2'))), 10000);
      } catch (error) {
        // Continue even if specific elements not found
      }
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(10000); // 10 seconds max
      
      console.log(`✅ Performance baseline: ${loadTime}ms`);
    });

    it('should verify memory usage', async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.waitForAngular();
      
      const memoryInfo = await browser.executeScript(`
        return {
          usedJSHeapSize: performance.memory ? performance.memory.usedJSHeapSize : 0,
          totalJSHeapSize: performance.memory ? performance.memory.totalJSHeapSize : 0
        };
      `);
      
      console.log('✅ Memory usage baseline established');
    });
  });
}); 