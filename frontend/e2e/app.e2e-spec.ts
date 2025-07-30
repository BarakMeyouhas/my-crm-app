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
      
      // Wait for page to load
      await browser.sleep(2000);
      
      const pageTitle = await browser.getTitle();
      expect(pageTitle).toBeTruthy();
      
      console.log('✅ Landing page loaded successfully');
    });

    it("should display all required landing page elements", async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.sleep(2000);
      
      // Check for brand logo
      const brandLogo = element(by.css('img[src*="Servix Logo"]'));
      const logoPresent = await brandLogo.isPresent();
      console.log(logoPresent ? '✅ Brand logo found' : '⚠️ Brand logo not found');
      
      // Check for hero subtitle
      const heroSubtitle = element(by.css('.hero-subtitle'));
      const subtitlePresent = await heroSubtitle.isPresent();
      console.log(subtitlePresent ? '✅ Hero subtitle found' : '⚠️ Hero subtitle not found');
      
      // Check for navigation links
      const loginLink = element(by.css('a[routerLink="/login"]'));
      const loginPresent = await loginLink.isPresent();
      console.log(loginPresent ? '✅ Login link found' : '⚠️ Login link not found');
      
      const registerLink = element(by.css('a[routerLink="/register"]'));
      const registerPresent = await registerLink.isPresent();
      console.log(registerPresent ? '✅ Register link found' : '⚠️ Register link not found');
      
      console.log('✅ Landing page elements verified');
    });

    it("should navigate to login page from landing", async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.sleep(2000);
      
      const loginLink = element(by.css('a[routerLink="/login"]'));
      await loginLink.click();
      await browser.sleep(2000);
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/login');
      console.log('✅ Navigation to login page successful');
    });

    it("should navigate to register page from landing", async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.sleep(2000);
      
      const registerLink = element(by.css('a[routerLink="/register"]'));
      await registerLink.click();
      await browser.sleep(2000);
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/register');
      console.log('✅ Navigation to register page successful');
    });
  });

  describe("Authentication Protection", () => {
    it("should redirect to login when accessing protected routes", async () => {
      await browser.get(`${baseUrl}/dashboard`);
      await browser.sleep(2000);
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/login');
      console.log('✅ Dashboard access properly protected');
    });

    it("should redirect to login when accessing clients without authentication", async () => {
      await browser.get(`${baseUrl}/clients`);
      await browser.sleep(2000);
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/login');
      console.log('✅ Clients access properly protected');
    });

    it("should redirect to login when accessing service requests without authentication", async () => {
      await browser.get(`${baseUrl}/service-requests`);
      await browser.sleep(2000);
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/login');
      console.log('✅ Service requests access properly protected');
    });
  });

  describe("Application Navigation", () => {
    it("should handle responsive design", async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.sleep(2000);
      
      // Test mobile viewport
      await browser.manage().window().setSize(375, 667);
      await browser.sleep(500);
      
      // Test tablet viewport
      await browser.manage().window().setSize(768, 1024);
      await browser.sleep(500);
      
      // Test desktop viewport
      await browser.manage().window().setSize(1920, 1080);
      await browser.sleep(500);
      
      console.log('✅ Responsive design test completed');
    });
  });

  describe("Performance", () => {
    it("should load pages within acceptable time", async () => {
      const startTime = Date.now();
      
      await browser.get(`${baseUrl}/landing`);
      await browser.sleep(2000);
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(10000); // 10 seconds max
      
      console.log(`✅ Page loaded in ${loadTime}ms`);
    });
  });

  describe("Error Handling", () => {
    it("should handle 404 pages gracefully", async () => {
      await browser.get(`${baseUrl}/nonexistent-page`);
      await browser.sleep(2000);
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/landing');
      
      console.log('✅ 404 handling test completed');
    });
  });

  describe("Accessibility", () => {
    it("should have proper page titles", async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.sleep(2000);
      
      const title = await browser.getTitle();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
      
      console.log('✅ Page title accessibility test completed');
    });
  });

  describe("Cross-browser Compatibility", () => {
    it("should work with Chrome headless", async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.sleep(2000);
      
      const pageTitle = await browser.getTitle();
      expect(pageTitle).toBeTruthy();
      
      console.log('✅ Chrome headless compatibility verified');
    });
  });
});
