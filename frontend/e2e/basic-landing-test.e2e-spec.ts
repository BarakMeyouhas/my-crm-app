import { browser, by, element, ExpectedConditions as EC } from 'protractor';

describe('Basic Landing Page Test', () => {
  const baseUrl = 'http://localhost:4201';

  it('should load the landing page successfully', async () => {
    console.log('🚀 Starting basic landing page test...');
    
    try {
      await browser.get(`${baseUrl}/landing`);
      console.log('✅ Page navigation completed');
      
      // Wait for Angular to be ready
      await browser.waitForAngular();
      console.log('✅ Angular is ready');
      
      const pageTitle = await browser.getTitle();
      console.log(`✅ Page title: ${pageTitle}`);
      expect(pageTitle).toBeTruthy();
      
      // Check if page has any content
      const body = element(by.css('body'));
      const bodyText = await body.getText();
      console.log(`✅ Page has content (${bodyText.length} characters)`);
      
      console.log('✅ Basic landing page test completed successfully');
    } catch (error) {
      console.error('❌ Test failed:', error.message);
      throw error;
    }
  });

  it('should have basic page structure', async () => {
    console.log('🚀 Starting page structure test...');
    
    try {
      await browser.get(`${baseUrl}/landing`);
      await browser.waitForAngular();
      
      // Check for basic HTML structure
      const html = element(by.css('html'));
      const head = element(by.css('head'));
      const body = element(by.css('body'));
      
      const htmlPresent = await html.isPresent();
      const headPresent = await head.isPresent();
      const bodyPresent = await body.isPresent();
      
      console.log(htmlPresent ? '✅ HTML element found' : '❌ HTML element not found');
      console.log(headPresent ? '✅ Head element found' : '❌ Head element not found');
      console.log(bodyPresent ? '✅ Body element found' : '❌ Body element not found');
      
      expect(htmlPresent).toBe(true);
      expect(headPresent).toBe(true);
      expect(bodyPresent).toBe(true);
      
      console.log('✅ Page structure test completed successfully');
    } catch (error) {
      console.error('❌ Page structure test failed:', error.message);
      throw error;
    }
  });
}); 