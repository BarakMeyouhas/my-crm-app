import { browser, by, element, ExpectedConditions as EC } from 'protractor';

describe('Minimal E2E Test', () => {
  const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4201';

  fit('should load page and display basic content', async () => {
    console.log('🧪 Starting minimal test...');
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    console.log(`🌐 Base URL: ${baseUrl}`);
    
    try {
      // Step 1: Navigate to page
      console.log('📱 Step 1: Navigating to page...');
      console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
      await browser.get(`${baseUrl}/`);
      console.log('✅ browser.get() completed');
      
      // Step 2: Get page title
      console.log('📄 Step 2: Getting page title...');
      console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
      const pageTitle = await browser.getTitle();
      console.log(`✅ Page title: ${pageTitle}`);
      
      // Step 3: Basic assertion
      console.log('✅ Step 3: Basic assertion...');
      console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
      expect(pageTitle).toBeTruthy();
      
      console.log('🎉 Minimal test completed successfully!');
      console.log(`⏰ Final timestamp: ${new Date().toISOString()}`);
      
    } catch (error) {
      console.error('❌ Minimal test failed!');
      console.error(`⏰ Error timestamp: ${new Date().toISOString()}`);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  });
}); 