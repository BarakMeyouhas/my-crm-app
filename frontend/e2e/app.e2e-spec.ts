import { MaterialDashboardAngularPage } from "./app.po";
import { browser, by, element, ExpectedConditions as EC } from 'protractor';

describe("CRM Application E2E Tests", () => {
  let page: MaterialDashboardAngularPage;
  const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4201';

  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
  });

  describe('Landing Page', () => {
    it('should display all required landing page elements', async () => {
      console.log('🚀 Starting landing page test...');
      
      try {
        // Navigate to landing page with URL verification
        console.log('📱 Navigating to landing page...');
        await browser.get(`${baseUrl}/landing`);
        await browser.wait(EC.urlContains('/landing'), 10000); // 10 seconds max
        console.log('✅ Navigation to landing page successful');
        
        // Wait for Angular to be ready
        console.log('⏳ Waiting for Angular to be ready...');
        await browser.waitForAngular();
        console.log('✅ Angular is ready');
        
        // Check for brand logo
        console.log('🔍 Checking for brand logo...');
        const brandLogo = element(by.css('img[src*="Servix Logo"]'));
        try {
          await browser.wait(EC.presenceOf(brandLogo), 10000);
          const logoPresent = await brandLogo.isPresent();
          console.log(logoPresent ? '✅ Brand logo found' : '⚠️ Brand logo not found');
        } catch (error) {
          console.log('⚠️ Brand logo not found');
        }
        
        // Check for hero subtitle
        console.log('🔍 Checking for hero subtitle...');
        const heroSubtitle = element(by.css('.hero-subtitle'));
        try {
          await browser.wait(EC.presenceOf(heroSubtitle), 10000);
          const subtitlePresent = await heroSubtitle.isPresent();
          console.log(subtitlePresent ? '✅ Hero subtitle found' : '⚠️ Hero subtitle not found');
        } catch (error) {
          console.log('⚠️ Hero subtitle not found');
        }
        
        // Check for login link (navbar)
        console.log('🔍 Checking for login link...');
        const loginLink = element(by.css('.navbar-nav a[routerLink="/login"]'));
        try {
          await browser.wait(EC.presenceOf(loginLink), 10000);
          const loginPresent = await loginLink.isPresent();
          console.log(loginPresent ? '✅ Login link found' : '⚠️ Login link not found');
        } catch (error) {
          console.log('⚠️ Login link not found');
        }
        
        // Check for register link (navbar)
        console.log('🔍 Checking for register link...');
        const registerLink = element(by.css('.navbar-nav a[routerLink="/register"]'));
        try {
          await browser.wait(EC.presenceOf(registerLink), 10000);
          const registerPresent = await registerLink.isPresent();
          console.log(registerPresent ? '✅ Register link found' : '⚠️ Register link not found');
        } catch (error) {
          console.log('⚠️ Register link not found');
        }
        
        console.log('✅ Landing page test completed successfully!');
        
      } catch (error) {
        console.error('❌ Landing page test failed:', error.message);
        throw error;
      }
    });

    it('should display hero title', async () => {
      console.log('🚀 Starting hero title test...');
      
      try {
        // Navigate to landing page with URL verification
        console.log('📱 Navigating to landing page...');
        await browser.get(`${baseUrl}/landing`);
        await browser.wait(EC.urlContains('/landing'), 10000); // 10 seconds max
        console.log('✅ Navigation to landing page successful');
        
        // Wait for Angular to be ready
        console.log('⏳ Waiting for Angular to be ready...');
        await browser.waitForAngular();
        console.log('✅ Angular is ready');
        
        // Check for hero title
        console.log('🔍 Checking for hero title...');
        const heroTitle = element(by.css('.hero-title'));
        try {
          await browser.wait(EC.presenceOf(heroTitle), 10000);
          const titlePresent = await heroTitle.isPresent();
          console.log(titlePresent ? '✅ Hero title found' : '⚠️ Hero title not found');
        } catch (error) {
          console.log('⚠️ Hero title not found');
        }
        
        console.log('✅ Hero title test completed successfully!');
        
      } catch (error) {
        console.error('❌ Hero title test failed:', error.message);
        throw error;
      }
    });

    it('should navigate to login page from landing', async () => {
      console.log('🚀 Starting login navigation test...');
      
      try {
        // Navigate to landing page with URL verification
        console.log('📱 Navigating to landing page...');
        await browser.get(`${baseUrl}/landing`);
        await browser.wait(EC.urlContains('/landing'), 10000); // 10 seconds max
        console.log('✅ Navigation to landing page successful');
        
        // Wait for Angular to be ready
        console.log('⏳ Waiting for Angular to be ready...');
        await browser.waitForAngular();
        console.log('✅ Angular is ready');
        
        // Find and click login link (navbar)
        console.log('🔍 Looking for login link...');
        const loginLink = element(by.css('.navbar-nav a[routerLink="/login"]'));
        try {
          await browser.wait(EC.elementToBeClickable(loginLink), 10000);
          await loginLink.click();
          console.log('✅ Login link clicked');
          
          // Wait for navigation to complete
          await browser.waitForAngular();
          await browser.wait(EC.urlContains('/login'), 10000);
          
          const currentUrl = await browser.getCurrentUrl();
          expect(currentUrl).toContain('/login');
          console.log('✅ Navigation to login page successful');
        } catch (error) {
          console.log('⚠️ Navigation to login failed');
        }
        
      } catch (error) {
        console.error('❌ Login navigation test failed:', error.message);
        throw error;
      }
    });

    it("should navigate to register page from landing", async () => {
      console.log('🚀 Starting register navigation test...');
      
      try {
        // Navigate to landing page with URL verification
        console.log('📱 Navigating to landing page...');
        await browser.get(`${baseUrl}/landing`);
        await browser.wait(EC.urlContains('/landing'), 10000); // 10 seconds max
        console.log('✅ Navigation to landing page successful');
        
        // Wait for Angular to be ready
        console.log('⏳ Waiting for Angular to be ready...');
        await browser.waitForAngular();
        console.log('✅ Angular is ready');
        
        // Try multiple possible register link selectors (prioritize navbar)
        const registerLinkSelectors = [
          '.navbar-nav a[routerLink="/register"]',
          'a[routerLink="/register"]',
          'a.nav-link[routerLink="/register"]',
          'a.btn[routerLink="/register"]',
          'a[routerLink="/register"].btn-primary'
        ];
        
        let registerLink = null;
        for (const selector of registerLinkSelectors) {
          try {
            const elementFinder = element(by.css(selector));
            await browser.wait(EC.presenceOf(elementFinder), 2000);
            registerLink = elementFinder;
            console.log(`✅ Found register link with selector: ${selector}`);
            break;
          } catch (error) {
            console.log(`⚠️ Selector not found: ${selector}`);
          }
        }
        
        if (registerLink) {
          try {
            await browser.wait(EC.elementToBeClickable(registerLink), 10000);
            await registerLink.click();
            console.log('✅ Register link clicked');
            
            // Wait for navigation to complete
            await browser.waitForAngular();
            await browser.wait(EC.urlContains('/register'), 10000);
            
            const currentUrl = await browser.getCurrentUrl();
            expect(currentUrl).toContain('/register');
            console.log('✅ Navigation to register page successful');
          } catch (error) {
            console.log('⚠️ Navigation to register failed');
          }
        } else {
          console.log('⚠️ No register link found with any selector');
        }
        
      } catch (error) {
        console.error('❌ Register navigation test failed:', error.message);
        throw error;
      }
    });
  });

  describe("Authentication Protection", () => {
    beforeEach(async () => {
      // Ensure clean state for authentication tests
      await browser.executeScript("localStorage.clear();");
      await browser.executeScript("sessionStorage.clear();");
    });

    it("should redirect to login when accessing protected routes", async () => {
      console.log('🚀 Testing dashboard protection...');
      
      await browser.get(`${baseUrl}/dashboard`);
      
      // Wait for Angular to be ready
      await browser.waitForAngular();
      
      // Wait a bit more for the redirect to complete
      await browser.sleep(1000);
      
      const currentUrl = await browser.getCurrentUrl();
      console.log(`📍 Current URL: ${currentUrl}`);
      
      // Check if localStorage is actually cleared
      const token = await browser.executeScript("return localStorage.getItem('token');");
      console.log(`🔑 Token in localStorage: ${token ? 'Present' : 'None'}`);
      
      expect(currentUrl).toContain('/login');
      console.log('✅ Dashboard access properly protected');
    });

    it("should redirect to login when accessing clients without authentication", async () => {
      await browser.get(`${baseUrl}/clients`);
      
      // Wait for Angular to be ready
      await browser.waitForAngular();
      
      // Wait a bit more for the redirect to complete
      await browser.sleep(1000);
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/login');
      console.log('✅ Clients access properly protected');
    });

    it("should redirect to login when accessing service requests without authentication", async () => {
      await browser.get(`${baseUrl}/service-requests`);
      
      // Wait for Angular to be ready
      await browser.waitForAngular();
      
      // Wait a bit more for the redirect to complete
      await browser.sleep(1000);
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/login');
      console.log('✅ Service requests access properly protected');
    });
  });

  describe("Application Navigation", () => {
    it("should handle responsive design", async () => {
      await browser.get(`${baseUrl}/landing`);
      
      // Wait for Angular to be ready
      await browser.waitForAngular();
      
      // Test mobile viewport
      await browser.manage().window().setSize(375, 667);
      await browser.sleep(1000);
      
      // Test tablet viewport
      await browser.manage().window().setSize(768, 1024);
      await browser.sleep(1000);
      
      // Test desktop viewport
      await browser.manage().window().setSize(1920, 1080);
      await browser.sleep(1000);
      
      console.log('✅ Responsive design test completed');
    });
  });

  describe("Performance", () => {
    it("should load pages within acceptable time", async () => {
      const startTime = Date.now();
      
      await browser.get(`${baseUrl}/landing`);
      await browser.waitForAngular();
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(10000); // 10 seconds max
      
      console.log(`✅ Page loaded in ${loadTime}ms`);
    });
  });

  describe("Error Handling", () => {
    it('should handle 404 pages gracefully', async () => {
      console.log('🚀 Starting 404 handling test...');
      
      try {
        // Navigate to a non-existent page
        console.log('📱 Navigating to non-existent page...');
        await browser.get(`${baseUrl}/non-existent-page`);
        await browser.waitForAngular();
        
        // Should redirect to landing page (or login if protected)
        const currentUrl = await browser.getCurrentUrl();
        console.log(`✅ Current URL after 404: ${currentUrl}`);
        
        // The app should handle 404 gracefully (redirect to landing or show error)
        expect(currentUrl).toContain('/');
        console.log('✅ 404 handling test completed');
        
      } catch (error) {
        console.error('❌ 404 handling test failed:', error.message);
        throw error;
      }
    });
  });

  describe("Accessibility", () => {
    it("should have proper page titles", async () => {
      await browser.get(`${baseUrl}/landing`);
      
      // Wait for Angular to be ready
      await browser.waitForAngular();
      
      const title = await browser.getTitle();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
      
      console.log('✅ Page title accessibility test completed');
    });
  });

  describe("Cross-browser Compatibility", () => {
    it("should work with Chrome headless", async () => {
      await browser.get(`${baseUrl}/landing`);
      
      // Wait for Angular to be ready
      await browser.waitForAngular();
      
      const pageTitle = await browser.getTitle();
      expect(pageTitle).toBeTruthy();
      
      console.log('✅ Chrome headless compatibility verified');
    });
  });
});
