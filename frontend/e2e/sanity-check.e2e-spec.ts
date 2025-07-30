import { browser, by, element, ExpectedConditions as EC } from 'protractor';

describe('Sanity Check E2E Test', () => {
  const baseUrl = 'http://localhost:4201';

  it('should load landing page and verify basic functionality', async () => {
    console.log('🧪 Starting sanity check test...');
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    
    try {
      // Step 1: Navigate to landing page
      console.log('📱 Step 1: Navigating to landing page...');
      console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
      await browser.get(`${baseUrl}/landing`);
      console.log('✅ browser.get() completed');
      
      // Step 2: Verify URL
      console.log('🔍 Step 2: Verifying URL...');
      console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
      await browser.wait(EC.urlContains('/landing'), 10000);
      console.log('✅ URL verification completed');
      
      // Step 3: Wait for Angular
      console.log('⏳ Step 3: Waiting for Angular...');
      console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
      await browser.waitForAngular();
      console.log('✅ Angular is ready');
      
      // Step 4: Check page title
      console.log('📄 Step 4: Checking page title...');
      console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
      const pageTitle = await browser.getTitle();
      console.log(`✅ Page title: ${pageTitle}`);
      
      // Step 5: Check for basic HTML structure
      console.log('🏗️ Step 5: Checking HTML structure...');
      console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
      const body = element(by.css('body'));
      const bodyText = await body.getText();
      console.log(`✅ Page has content (${bodyText.length} characters)`);
      
      // Step 6: Check for any Angular app content
      console.log('🔍 Step 6: Checking for Angular app content...');
      console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
      const appRoot = element(by.css('app-root, [ng-version], .landing-page'));
      const appPresent = await appRoot.isPresent();
      console.log(`✅ Angular app content: ${appPresent}`);
      
      console.log('🎉 Sanity check test completed successfully!');
      console.log(`⏰ Final timestamp: ${new Date().toISOString()}`);
      
    } catch (error) {
      console.error('❌ Sanity check test failed!');
      console.error(`⏰ Error timestamp: ${new Date().toISOString()}`);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  });

  it('should verify ChromeDriver is working correctly', async () => {
    console.log('🔧 Starting ChromeDriver verification test...');
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    
    try {
      // Test basic browser operations
      console.log('📱 Testing browser operations...');
      await browser.get(`${baseUrl}/landing`);
      console.log('✅ browser.get() completed');
      
      // Test element finding
      console.log('🔍 Testing element finding...');
      const title = await browser.getTitle();
      console.log(`✅ Browser operations working: ${title}`);
      
      // Test element interaction
      console.log('🖱️ Testing element interaction...');
      const body = element(by.css('body'));
      const isPresent = await body.isPresent();
      console.log(`✅ Element interaction working: ${isPresent}`);
      
      // Test JavaScript execution
      console.log('⚡ Testing JavaScript execution...');
      const userAgent = await browser.executeScript('return navigator.userAgent;') as string;
      console.log(`✅ JavaScript execution working: ${userAgent.includes('Chrome')}`);
      
      console.log('🎉 ChromeDriver test completed successfully!');
      console.log(`⏰ Final timestamp: ${new Date().toISOString()}`);
      
    } catch (error) {
      console.error('❌ ChromeDriver test failed!');
      console.error(`⏰ Error timestamp: ${new Date().toISOString()}`);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  });
}); 