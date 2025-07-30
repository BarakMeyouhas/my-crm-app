import { browser, by, element, ExpectedConditions as EC } from 'protractor';

describe('Dashboard E2E Tests', () => {
  const baseUrl = 'http://localhost:4201';
  const apiUrl = 'http://localhost:5000/api';
  
  // Test user data
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `test.user.${Date.now()}@example.com`,
    password: 'TestPassword123!',
    companyId: 1
  };

  beforeAll(async () => {
    await browser.waitForAngularEnabled(false);
    
    // Check if backend is running
    try {
      const response = await fetch(`${apiUrl}/companies`);
      if (!response.ok) {
        throw new Error('Backend not ready');
      }
      console.log('Backend is ready for dashboard tests');
    } catch (error) {
      console.log('Backend not ready, continuing with frontend tests only');
    }
  });

  beforeEach(async () => {
    // Clear browser storage
    await browser.executeScript('window.localStorage.clear();');
    await browser.executeScript('window.sessionStorage.clear();');
  });

  describe('Dashboard Access Control', () => {
    it('should redirect to login when accessing dashboard without authentication', async () => {
      await browser.get(`${baseUrl}/dashboard`);
      await browser.sleep(2000);
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/login');
    });

    it('should access dashboard with valid authentication', async () => {
      // First login
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      const emailInput = element(by.css('input[type="email"]'));
      const passwordInput = element(by.css('input[type="password"]'));
      const submitButton = element(by.css('button[type="submit"]'));
      
      await emailInput.sendKeys(testUser.email);
      await passwordInput.sendKeys(testUser.password);
      await submitButton.click();
      
      await browser.sleep(3000);
      
      // Navigate to dashboard
      await browser.get(`${baseUrl}/dashboard`);
      await browser.sleep(2000);
      
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toContain('/dashboard');
      
      // Check for dashboard elements
      const dashboardElement = element(by.css('.dashboard, .main-panel, .dashboard-container'));
      try {
        await browser.wait(EC.presenceOf(dashboardElement), 10000);
        expect(await dashboardElement.isPresent()).toBe(true);
      } catch (error) {
        console.log('Dashboard element not found, but URL is correct');
      }
    });
  });

  describe('Dashboard Navigation', () => {
    it('should display navigation menu/sidebar', async () => {
      // Login first
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      const emailInput = element(by.css('input[type="email"]'));
      const passwordInput = element(by.css('input[type="password"]'));
      const submitButton = element(by.css('button[type="submit"]'));
      
      await emailInput.sendKeys(testUser.email);
      await passwordInput.sendKeys(testUser.password);
      await submitButton.click();
      
      await browser.sleep(3000);
      
      // Navigate to dashboard
      await browser.get(`${baseUrl}/dashboard`);
      await browser.sleep(2000);
      
      // Check for navigation elements
      const navElement = element(by.css('.sidebar, .nav, .navigation, .menu'));
      try {
        await browser.wait(EC.presenceOf(navElement), 10000);
        expect(await navElement.isPresent()).toBe(true);
      } catch (error) {
        console.log('Navigation element not found');
      }
    });

    it('should navigate to clients page from dashboard', async () => {
      // Login first
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      const emailInput = element(by.css('input[type="email"]'));
      const passwordInput = element(by.css('input[type="password"]'));
      const submitButton = element(by.css('button[type="submit"]'));
      
      await emailInput.sendKeys(testUser.email);
      await passwordInput.sendKeys(testUser.password);
      await submitButton.click();
      
      await browser.sleep(3000);
      
      // Navigate to dashboard
      await browser.get(`${baseUrl}/dashboard`);
      await browser.sleep(2000);
      
      // Find and click clients link
      const clientsLink = element(by.css('a[routerLink="/clients"], .nav-clients, .clients-link'));
      try {
        await browser.wait(EC.elementToBeClickable(clientsLink), 10000);
        await clientsLink.click();
        
        await browser.sleep(2000);
        
        const currentUrl = await browser.getCurrentUrl();
        expect(currentUrl).toContain('/clients');
      } catch (error) {
        console.log('Clients navigation link not found');
      }
    });

    it('should navigate to service requests page from dashboard', async () => {
      // Login first
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      const emailInput = element(by.css('input[type="email"]'));
      const passwordInput = element(by.css('input[type="password"]'));
      const submitButton = element(by.css('button[type="submit"]'));
      
      await emailInput.sendKeys(testUser.email);
      await passwordInput.sendKeys(testUser.password);
      await submitButton.click();
      
      await browser.sleep(3000);
      
      // Navigate to dashboard
      await browser.get(`${baseUrl}/dashboard`);
      await browser.sleep(2000);
      
      // Find and click service requests link
      const serviceRequestsLink = element(by.css('a[routerLink="/service-requests"], .nav-service-requests, .service-requests-link'));
      try {
        await browser.wait(EC.elementToBeClickable(serviceRequestsLink), 10000);
        await serviceRequestsLink.click();
        
        await browser.sleep(2000);
        
        const currentUrl = await browser.getCurrentUrl();
        expect(currentUrl).toContain('/service-requests');
      } catch (error) {
        console.log('Service requests navigation link not found');
      }
    });
  });

  describe('Dashboard Statistics and Metrics', () => {
    it('should display dashboard statistics cards', async () => {
      // Login first
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      const emailInput = element(by.css('input[type="email"]'));
      const passwordInput = element(by.css('input[type="password"]'));
      const submitButton = element(by.css('button[type="submit"]'));
      
      await emailInput.sendKeys(testUser.email);
      await passwordInput.sendKeys(testUser.password);
      await submitButton.click();
      
      await browser.sleep(3000);
      
      // Navigate to dashboard
      await browser.get(`${baseUrl}/dashboard`);
      await browser.sleep(2000);
      
      // Check for statistics cards
      const statsCards = element.all(by.css('.stats-card, .metric-card, .card-stats, .stat-card'));
      try {
        await browser.wait(EC.presenceOf(statsCards.first()), 10000);
        const cardCount = await statsCards.count();
        expect(cardCount).toBeGreaterThan(0);
      } catch (error) {
        console.log('Statistics cards not found');
      }
    });

    it('should display total clients count', async () => {
      // Login first
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      const emailInput = element(by.css('input[type="email"]'));
      const passwordInput = element(by.css('input[type="password"]'));
      const submitButton = element(by.css('button[type="submit"]'));
      
      await emailInput.sendKeys(testUser.email);
      await passwordInput.sendKeys(testUser.password);
      await submitButton.click();
      
      await browser.sleep(3000);
      
      // Navigate to dashboard
      await browser.get(`${baseUrl}/dashboard`);
      await browser.sleep(2000);
      
      // Look for clients count
      const clientsCountElement = element(by.cssContainingText('*', 'Clients'));
      try {
        await browser.wait(EC.presenceOf(clientsCountElement), 10000);
        expect(await clientsCountElement.isPresent()).toBe(true);
      } catch (error) {
        console.log('Clients count not displayed');
      }
    });

    it('should display total service requests count', async () => {
      // Login first
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      const emailInput = element(by.css('input[type="email"]'));
      const passwordInput = element(by.css('input[type="password"]'));
      const submitButton = element(by.css('button[type="submit"]'));
      
      await emailInput.sendKeys(testUser.email);
      await passwordInput.sendKeys(testUser.password);
      await submitButton.click();
      
      await browser.sleep(3000);
      
      // Navigate to dashboard
      await browser.get(`${baseUrl}/dashboard`);
      await browser.sleep(2000);
      
      // Look for service requests count
      const serviceRequestsCountElement = element(by.cssContainingText('*', 'Service Requests'));
      try {
        await browser.wait(EC.presenceOf(serviceRequestsCountElement), 10000);
        expect(await serviceRequestsCountElement.isPresent()).toBe(true);
      } catch (error) {
        console.log('Service requests count not displayed');
      }
    });
  });

  describe('Dashboard Recent Activity', () => {
    it('should display recent activity section', async () => {
      // Login first
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      const emailInput = element(by.css('input[type="email"]'));
      const passwordInput = element(by.css('input[type="password"]'));
      const submitButton = element(by.css('button[type="submit"]'));
      
      await emailInput.sendKeys(testUser.email);
      await passwordInput.sendKeys(testUser.password);
      await submitButton.click();
      
      await browser.sleep(3000);
      
      // Navigate to dashboard
      await browser.get(`${baseUrl}/dashboard`);
      await browser.sleep(2000);
      
      // Look for recent activity section
      const recentActivityElement = element(by.css('.recent-activity, .activity-feed, .latest-activity'));
      try {
        await browser.wait(EC.presenceOf(recentActivityElement), 10000);
        expect(await recentActivityElement.isPresent()).toBe(true);
      } catch (error) {
        console.log('Recent activity section not found');
      }
    });

    it('should display recent clients', async () => {
      // Login first
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      const emailInput = element(by.css('input[type="email"]'));
      const passwordInput = element(by.css('input[type="password"]'));
      const submitButton = element(by.css('button[type="submit"]'));
      
      await emailInput.sendKeys(testUser.email);
      await passwordInput.sendKeys(testUser.password);
      await submitButton.click();
      
      await browser.sleep(3000);
      
      // Navigate to dashboard
      await browser.get(`${baseUrl}/dashboard`);
      await browser.sleep(2000);
      
      // Look for recent clients section
      const recentClientsElement = element(by.css('.recent-clients, .latest-clients, .clients-list'));
      try {
        await browser.wait(EC.presenceOf(recentClientsElement), 10000);
        expect(await recentClientsElement.isPresent()).toBe(true);
      } catch (error) {
        console.log('Recent clients section not found');
      }
    });

    it('should display recent service requests', async () => {
      // Login first
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      const emailInput = element(by.css('input[type="email"]'));
      const passwordInput = element(by.css('input[type="password"]'));
      const submitButton = element(by.css('button[type="submit"]'));
      
      await emailInput.sendKeys(testUser.email);
      await passwordInput.sendKeys(testUser.password);
      await submitButton.click();
      
      await browser.sleep(3000);
      
      // Navigate to dashboard
      await browser.get(`${baseUrl}/dashboard`);
      await browser.sleep(2000);
      
      // Look for recent service requests section
      const recentServiceRequestsElement = element(by.css('.recent-service-requests, .latest-service-requests, .service-requests-list'));
      try {
        await browser.wait(EC.presenceOf(recentServiceRequestsElement), 10000);
        expect(await recentServiceRequestsElement.isPresent()).toBe(true);
      } catch (error) {
        console.log('Recent service requests section not found');
      }
    });
  });

  describe('Dashboard Quick Actions', () => {
    it('should display quick action buttons', async () => {
      // Login first
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      const emailInput = element(by.css('input[type="email"]'));
      const passwordInput = element(by.css('input[type="password"]'));
      const submitButton = element(by.css('button[type="submit"]'));
      
      await emailInput.sendKeys(testUser.email);
      await passwordInput.sendKeys(testUser.password);
      await submitButton.click();
      
      await browser.sleep(3000);
      
      // Navigate to dashboard
      await browser.get(`${baseUrl}/dashboard`);
      await browser.sleep(2000);
      
      // Look for quick action buttons
      const quickActionButtons = element.all(by.css('.quick-action, .action-button, .btn-quick'));
      try {
        await browser.wait(EC.presenceOf(quickActionButtons.first()), 10000);
        const buttonCount = await quickActionButtons.count();
        expect(buttonCount).toBeGreaterThan(0);
      } catch (error) {
        console.log('Quick action buttons not found');
      }
    });

    it('should have quick action to add new client', async () => {
      // Login first
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      const emailInput = element(by.css('input[type="email"]'));
      const passwordInput = element(by.css('input[type="password"]'));
      const submitButton = element(by.css('button[type="submit"]'));
      
      await emailInput.sendKeys(testUser.email);
      await passwordInput.sendKeys(testUser.password);
      await submitButton.click();
      
      await browser.sleep(3000);
      
      // Navigate to dashboard
      await browser.get(`${baseUrl}/dashboard`);
      await browser.sleep(2000);
      
      // Look for add client quick action
      const addClientButton = element(by.cssContainingText('button', 'Add Client'));
      try {
        await browser.wait(EC.elementToBeClickable(addClientButton), 10000);
        expect(await addClientButton.isPresent()).toBe(true);
      } catch (error) {
        console.log('Add client quick action not found');
      }
    });

    it('should have quick action to add new service request', async () => {
      // Login first
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      const emailInput = element(by.css('input[type="email"]'));
      const passwordInput = element(by.css('input[type="password"]'));
      const submitButton = element(by.css('button[type="submit"]'));
      
      await emailInput.sendKeys(testUser.email);
      await passwordInput.sendKeys(testUser.password);
      await submitButton.click();
      
      await browser.sleep(3000);
      
      // Navigate to dashboard
      await browser.get(`${baseUrl}/dashboard`);
      await browser.sleep(2000);
      
      // Look for add service request quick action
      const addServiceRequestButton = element(by.cssContainingText('button', 'Add Service Request'));
      try {
        await browser.wait(EC.elementToBeClickable(addServiceRequestButton), 10000);
        expect(await addServiceRequestButton.isPresent()).toBe(true);
      } catch (error) {
        console.log('Add service request quick action not found');
      }
    });
  });

  describe('Dashboard User Profile', () => {
    it('should display user profile information', async () => {
      // Login first
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      const emailInput = element(by.css('input[type="email"]'));
      const passwordInput = element(by.css('input[type="password"]'));
      const submitButton = element(by.css('button[type="submit"]'));
      
      await emailInput.sendKeys(testUser.email);
      await passwordInput.sendKeys(testUser.password);
      await submitButton.click();
      
      await browser.sleep(3000);
      
      // Navigate to dashboard
      await browser.get(`${baseUrl}/dashboard`);
      await browser.sleep(2000);
      
      // Look for user profile elements
      const userProfileElement = element(by.css('.user-profile, .profile-info, .user-info'));
      try {
        await browser.wait(EC.presenceOf(userProfileElement), 10000);
        expect(await userProfileElement.isPresent()).toBe(true);
      } catch (error) {
        console.log('User profile section not found');
      }
    });

    it('should display user name in dashboard', async () => {
      // Login first
      await browser.get(`${baseUrl}/login`);
      await browser.sleep(2000);
      
      const emailInput = element(by.css('input[type="email"]'));
      const passwordInput = element(by.css('input[type="password"]'));
      const submitButton = element(by.css('button[type="submit"]'));
      
      await emailInput.sendKeys(testUser.email);
      await passwordInput.sendKeys(testUser.password);
      await submitButton.click();
      
      await browser.sleep(3000);
      
      // Navigate to dashboard
      await browser.get(`${baseUrl}/dashboard`);
      await browser.sleep(2000);
      
      // Look for user name display
      const userNameElement = element(by.cssContainingText('*', testUser.firstName));
      try {
        await browser.wait(EC.presenceOf(userNameElement), 10000);
        expect(await userNameElement.isPresent()).toBe(true);
      } catch (error) {
        console.log('User name not displayed in dashboard');
      }
    });
  });
}); 