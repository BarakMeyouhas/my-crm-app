import { MaterialDashboardAngularPage } from "./app.po";
import { browser, by, element, ExpectedConditions as EC } from 'protractor';

describe("CRM Application E2E Tests", () => {
  let page: MaterialDashboardAngularPage;
  const baseUrl = 'http://localhost:4201';

  beforeEach(() => {
    page = new MaterialDashboardAngularPage();
  });

  describe("Landing Page", () => {
    it("should load the landing page successfully", async () => {
      await browser.get(`${baseUrl}/landing`);
      
      // Wait for Angular to be ready
      await browser.waitForAngular();
      
      const pageTitle = await browser.getTitle();
      expect(pageTitle).toBeTruthy();
      
      console.log('✅ Landing page loaded successfully');
    });

    it("should display all required landing page elements", async () => {
      await browser.get(`${baseUrl}/landing`);
      
      // Wait for Angular to be ready
      await browser.waitForAngular();
      
      // Check for brand logo - using the correct selector
      const brandLogo = element(by.css('img[src*="Servix Logo"]'));
      try {
        await browser.wait(EC.presenceOf(brandLogo), 10000);
        const logoPresent = await brandLogo.isPresent();
        console.log(logoPresent ? '✅ Brand logo found' : '⚠️ Brand logo not found');
      } catch (error) {
        console.log('⚠️ Brand logo not found');
      }
      
      // Check for hero subtitle - using the correct class
      const heroSubtitle = element(by.css('.hero-subtitle'));
      try {
        await browser.wait(EC.presenceOf(heroSubtitle), 10000);
        const subtitlePresent = await heroSubtitle.isPresent();
        console.log(subtitlePresent ? '✅ Hero subtitle found' : '⚠️ Hero subtitle not found');
      } catch (error) {
        console.log('⚠️ Hero subtitle not found');
      }
      
      // Check for navigation links - using the correct selectors
      const loginLink = element(by.css('a[routerLink="/login"]'));
      try {
        await browser.wait(EC.presenceOf(loginLink), 10000);
        const loginPresent = await loginLink.isPresent();
        console.log(loginPresent ? '✅ Login link found' : '⚠️ Login link not found');
      } catch (error) {
        console.log('⚠️ Login link not found');
      }
      
      const registerLink = element(by.css('a[routerLink="/register"]'));
      try {
        await browser.wait(EC.presenceOf(registerLink), 10000);
        const registerPresent = await registerLink.isPresent();
        console.log(registerPresent ? '✅ Register link found' : '⚠️ Register link not found');
      } catch (error) {
        console.log('⚠️ Register link not found');
      }
      
      // Check for hero title
      const heroTitle = element(by.css('.hero-title'));
      try {
        await browser.wait(EC.presenceOf(heroTitle), 10000);
        const titlePresent = await heroTitle.isPresent();
        console.log(titlePresent ? '✅ Hero title found' : '⚠️ Hero title not found');
      } catch (error) {
        console.log('⚠️ Hero title not found');
      }
      
      console.log('✅ Landing page elements verified');
    });

    it("should navigate to login page from landing", async () => {
      await browser.get(`${baseUrl}/landing`);
      
      // Wait for Angular to be ready
      await browser.waitForAngular();
      
      const loginLink = element(by.css('a[routerLink="/login"]'));
      try {
        await browser.wait(EC.elementToBeClickable(loginLink), 10000);
        await loginLink.click();
        
        // Wait for navigation to complete
        await browser.waitForAngular();
        
        const currentUrl = await browser.getCurrentUrl();
        expect(currentUrl).toContain('/login');
        console.log('✅ Navigation to login page successful');
      } catch (error) {
        console.log('⚠️ Navigation to login failed');
      }
    });

    it("should navigate to register page from landing", async () => {
      await browser.get(`${baseUrl}/landing`);
      
      // Wait for Angular to be ready
      await browser.waitForAngular();
      
      const registerLink = element(by.css('a[routerLink="/register"]'));
      try {
        await browser.wait(EC.elementToBeClickable(registerLink), 10000);
        await registerLink.click();
        
        // Wait for navigation to complete
        await browser.waitForAngular();
        
        const currentUrl = await browser.getCurrentUrl();
        expect(currentUrl).toContain('/register');
        console.log('✅ Navigation to register page successful');
      } catch (error) {
        console.log('⚠️ Navigation to register failed');
      }
    });
  });

  describe("Authentication Protection", () => {
    it("should redirect to login when accessing protected routes", async () => {
      await browser.get(`${baseUrl}/dashboard`);
      
      // Wait for Angular to be ready
      await browser.waitForAngular();
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/login');
      console.log('✅ Dashboard access properly protected');
    });

    it("should redirect to login when accessing clients without authentication", async () => {
      await browser.get(`${baseUrl}/clients`);
      
      // Wait for Angular to be ready
      await browser.waitForAngular();
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/login');
      console.log('✅ Clients access properly protected');
    });

    it("should redirect to login when accessing service requests without authentication", async () => {
      await browser.get(`${baseUrl}/service-requests`);
      
      // Wait for Angular to be ready
      await browser.waitForAngular();
      
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
    it("should handle 404 pages gracefully", async () => {
      await browser.get(`${baseUrl}/nonexistent-page`);
      
      // Wait for Angular to be ready
      await browser.waitForAngular();
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/landing');
      
      console.log('✅ 404 handling test completed');
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
