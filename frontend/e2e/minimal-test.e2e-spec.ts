import { browser, by, element, ExpectedConditions as EC } from 'protractor';

describe('Ultra Minimal E2E Test', () => {
  const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4201';

  it('should start Protractor without hanging', async () => {
    console.log('🧪 Starting ultra minimal test...');
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    console.log(`🌐 Base URL: ${baseUrl}`);
    
    try {
      // Step 1: Disable Angular waiting to prevent hanging
      console.log('📱 Step 1: Disabling Angular waiting...');
      console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
      await browser.waitForAngularEnabled(false);
      console.log('✅ Angular waiting disabled');
      
      // Step 2: Navigate to page
      console.log('🌐 Step 2: Navigating to page...');
      console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
      await browser.get(`${baseUrl}/`);
      console.log('✅ browser.get() completed');
      
      // Step 3: Get page title
      console.log('📄 Step 3: Getting page title...');
      console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
      const pageTitle = await browser.getTitle();
      console.log(`✅ Page title: ${pageTitle}`);
      
      // Step 4: Simple assertion
      console.log('✅ Step 4: Basic assertion...');
      console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
      expect(pageTitle).toBeTruthy();
      
      console.log('🎉 Ultra minimal test completed successfully!');
      console.log(`⏰ Final timestamp: ${new Date().toISOString()}`);
      
    } catch (error) {
      console.error('❌ Ultra minimal test failed!');
      console.error(`⏰ Error timestamp: ${new Date().toISOString()}`);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  });
}); 