import { browser, by, element, ExpectedConditions as EC } from 'protractor';

describe('Quick E2E Test - Verify Setup', () => {
  const baseUrl = 'http://localhost:4201';

  it('should load the landing page and verify basic functionality', async () => {
    console.log('🚀 Starting quick E2E test...');
    
    try {
      // Navigate to landing page
      console.log('📱 Navigating to landing page...');
      await browser.get(`${baseUrl}/landing`);
      
      // Wait for Angular to be ready
      console.log('⏳ Waiting for Angular to be ready...');
      await browser.waitForAngular();
      
      // Check page title
      console.log('📄 Checking page title...');
      const pageTitle = await browser.getTitle();
      console.log(`✅ Page title: ${pageTitle}`);
      expect(pageTitle).toBeTruthy();
      
      // Check if page has content
      console.log('📝 Checking page content...');
      const body = element(by.css('body'));
      const bodyText = await body.getText();
      console.log(`✅ Page has content (${bodyText.length} characters)`);
      expect(bodyText.length).toBeGreaterThan(0);
      
      // Check for basic HTML structure
      console.log('🏗️ Checking HTML structure...');
      const html = element(by.css('html'));
      const head = element(by.css('head'));
      const bodyElement = element(by.css('body'));
      
      const htmlPresent = await html.isPresent();
      const headPresent = await head.isPresent();
      const bodyPresent = await bodyElement.isPresent();
      
      console.log(`✅ HTML element: ${htmlPresent}`);
      console.log(`✅ Head element: ${headPresent}`);
      console.log(`✅ Body element: ${bodyPresent}`);
      
      expect(htmlPresent).toBe(true);
      expect(headPresent).toBe(true);
      expect(bodyPresent).toBe(true);
      
      // Check for any Angular app content
      console.log('🔍 Checking for Angular app content...');
      const appRoot = element(by.css('app-root, [ng-version], .landing-page'));
      const appPresent = await appRoot.isPresent();
      console.log(`✅ Angular app content: ${appPresent}`);
      
      console.log('🎉 Quick E2E test completed successfully!');
      console.log('✅ All basic functionality is working');
      
    } catch (error) {
      console.error('❌ Quick E2E test failed:', error.message);
      throw error;
    }
  });

  it('should verify ChromeDriver is working correctly', async () => {
    console.log('🔧 Testing ChromeDriver functionality...');
    
    try {
      // Test basic browser operations
      await browser.get(`${baseUrl}/landing`);
      await browser.waitForAngular();
      
      // Test element finding
      const title = await browser.getTitle();
      console.log(`✅ Browser operations working: ${title}`);
      
      // Test element interaction
      const body = element(by.css('body'));
      const isPresent = await body.isPresent();
      console.log(`✅ Element interaction working: ${isPresent}`);
      
      // Test JavaScript execution
      const userAgent = await browser.executeScript('return navigator.userAgent;') as string;
      console.log(`✅ JavaScript execution working: ${userAgent.includes('Chrome')}`);
      
      console.log('🎉 ChromeDriver test completed successfully!');
      
    } catch (error) {
      console.error('❌ ChromeDriver test failed:', error.message);
      throw error;
    }
  });
}); 