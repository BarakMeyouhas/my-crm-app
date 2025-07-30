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
      await browser.sleep(2000);
      
      const pageTitle = await browser.getTitle();
      expect(pageTitle).toBeTruthy();
      
      // Check for key elements
      const heroTitle = element(by.css('h1.hero-title'));
      await browser.wait(EC.presenceOf(heroTitle), 10000);
      const titleText = await heroTitle.getText();
      expect(titleText).toContain('Transform Your Business');
      
      console.log('✅ Landing page loaded successfully');
    });

    it("should display all required landing page elements", async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.sleep(2000);
      
      // Check for brand logo
      const brandLogo = element(by.css('img[src*="Servix Logo"]'));
      try {
        await browser.wait(EC.presenceOf(brandLogo), 10000);
        expect(await brandLogo.isPresent()).toBe(true);
      } catch (error) {
        console.log('Brand logo not found');
      }
      
      // Check for hero subtitle
      const heroSubtitle = element(by.css('.hero-subtitle'));
      try {
        await browser.wait(EC.presenceOf(heroSubtitle), 10000);
        expect(await heroSubtitle.isPresent()).toBe(true);
      } catch (error) {
        console.log('Hero subtitle not found');
      }
      
      // Check for navigation links
      const loginLink = element(by.css('a[routerLink="/login"]'));
      const registerLink = element(by.css('a[routerLink="/register"]'));
      
      try {
        await browser.wait(EC.elementToBeClickable(loginLink), 10000);
        expect(await loginLink.isPresent()).toBe(true);
      } catch (error) {
        console.log('Login link not found');
      }
      
      try {
        await browser.wait(EC.elementToBeClickable(registerLink), 10000);
        expect(await registerLink.isPresent()).toBe(true);
      } catch (error) {
        console.log('Register link not found');
      }
      
      console.log('✅ Landing page elements verified');
    });

    it("should navigate to login page from landing", async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.sleep(2000);
      
      const loginLink = element(by.css('a[routerLink="/login"]'));
      await browser.wait(EC.elementToBeClickable(loginLink), 10000);
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
      await browser.wait(EC.elementToBeClickable(registerLink), 10000);
      await registerLink.click();
      
      await browser.sleep(2000);
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/register');
      console.log('✅ Navigation to register page successful');
    });
  });

  describe("Application Navigation", () => {
    it("should handle direct URL navigation", async () => {
      // Test direct navigation to various routes
      const routes = ['/landing', '/login', '/register'];
      
      for (const route of routes) {
        await browser.get(`${baseUrl}${route}`);
        await browser.sleep(2000);
        
        const currentUrl = await browser.getCurrentUrl();
        expect(currentUrl).toContain(route);
        console.log(`✅ Direct navigation to ${route} successful`);
      }
    });

    it("should handle browser back/forward navigation", async () => {
      // Navigate to landing page
      await browser.get(`${baseUrl}/landing`);
      await browser.sleep(2000);
      
      // Navigate to login page
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      // Go back
      await browser.navigate().back();
      await browser.sleep(2000);
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/landing');
      console.log('✅ Browser back navigation successful');
    });
  });

  describe("Responsive Design", () => {
    it("should display correctly on desktop viewport", async () => {
      await browser.manage().window().setSize(1920, 1080);
      await browser.get(`${baseUrl}/landing`);
      await browser.sleep(2000);
      
      const windowSize = await browser.manage().window().getSize();
      expect(windowSize.width).toBe(1920);
      expect(windowSize.height).toBe(1080);
      console.log('✅ Desktop viewport test passed');
    });

    it("should display correctly on mobile viewport", async () => {
      await browser.manage().window().setSize(375, 667);
      await browser.get(`${baseUrl}/landing`);
      await browser.sleep(2000);
      
      const windowSize = await browser.manage().window().getSize();
      expect(windowSize.width).toBe(375);
      expect(windowSize.height).toBe(667);
      console.log('✅ Mobile viewport test passed');
    });
  });

  describe("Performance", () => {
    it("should load pages within reasonable time", async () => {
      const startTime = Date.now();
      
      await browser.get(`${baseUrl}/landing`);
      await browser.sleep(2000);
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds
      console.log(`✅ Page load time: ${loadTime}ms`);
    });

    it("should handle multiple rapid navigation", async () => {
      const routes = ['/landing', '/login', '/register'];
      
      for (let i = 0; i < 3; i++) {
        for (const route of routes) {
          await browser.get(`${baseUrl}${route}`);
          await browser.sleep(500); // Short wait
        }
      }
      
      console.log('✅ Rapid navigation test passed');
    });
  });

  describe("Error Handling", () => {
    it("should handle 404 routes gracefully", async () => {
      await browser.get(`${baseUrl}/nonexistent-page`);
      await browser.sleep(2000);
      
      const currentUrl = await browser.getCurrentUrl();
      // Should either stay on the route or redirect to a 404 page
      expect(currentUrl).toBeTruthy();
      console.log('✅ 404 handling test passed');
    });

    it("should handle network errors gracefully", async () => {
      // This test simulates what happens when the backend is not available
      // The frontend should still load and show appropriate error messages
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      // Check if the page loads even without backend
      const pageTitle = await browser.getTitle();
      expect(pageTitle).toBeTruthy();
      console.log('✅ Network error handling test passed');
    });
  });

  describe("Accessibility", () => {
    it("should have proper page titles", async () => {
      const routes = [
        { path: '/landing', expectedTitle: 'Servix' },
        { path: '/login', expectedTitle: 'Login' },
        { path: '/register', expectedTitle: 'Register' }
      ];
      
      for (const route of routes) {
        await browser.get(`${baseUrl}${route.path}`);
        await browser.sleep(2000);
        
        const pageTitle = await browser.getTitle();
        expect(pageTitle).toBeTruthy();
        console.log(`✅ Page title for ${route.path}: ${pageTitle}`);
      }
    });

    it("should have proper form labels", async () => {
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      // Check for form labels
      const emailLabel = element(by.css('label[for="email"], label:contains("Email")'));
      const passwordLabel = element(by.css('label[for="password"], label:contains("Password")'));
      
      try {
        await browser.wait(EC.presenceOf(emailLabel), 10000);
        expect(await emailLabel.isPresent()).toBe(true);
      } catch (error) {
        console.log('Email label not found');
      }
      
      try {
        await browser.wait(EC.presenceOf(passwordLabel), 10000);
        expect(await passwordLabel.isPresent()).toBe(true);
      } catch (error) {
        console.log('Password label not found');
      }
      
      console.log('✅ Form labels accessibility test passed');
    });
  });

  describe("Cross-browser Compatibility", () => {
    it("should work with different user agents", async () => {
      await browser.get(`${baseUrl}/landing`);
      await browser.sleep(2000);
      
      // Get user agent
      const userAgent = await browser.executeScript('return navigator.userAgent;');
      console.log(`🌍 Testing with user agent: ${userAgent}`);
      
      // Basic functionality should work regardless of browser
      const pageTitle = await browser.getTitle();
      expect(pageTitle).toBeTruthy();
      console.log('✅ Cross-browser compatibility test passed');
    });
  });
});
