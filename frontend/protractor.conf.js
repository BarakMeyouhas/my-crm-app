// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
const path = require('path');

exports.config = {
  allScriptsTimeout: 180000, // Increased from 120000
  getPageTimeout: 60000, // Added page timeout
  SELENIUM_PROMISE_MANAGER: false, // Disable control flow manager
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': [
        '--headless',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1920,1080',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--remote-debugging-port=9222',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-ipc-flooding-protection',
        '--incognito',
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-sync',
        '--disable-translate',
        '--hide-scrollbars',
        '--mute-audio',
        '--no-first-run',
        '--safebrowsing-disable-auto-update',
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
        '--disable-notifications',
        '--disable-popup-blocking',
        '--disable-prompt-on-repost',
        '--disable-save-password-bubble',
        '--disable-single-click-autofill',
        '--disable-translate-script-url',
        '--disable-web-resources',
        '--force-device-scale-factor=1',
        '--force-color-profile=srgb',
        '--metrics-recording-only',
        '--no-default-browser-check',
        '--no-pings',
        '--no-zygote',
        '--password-store=basic',
        '--use-mock-keychain',
        '--use-gl=swiftshader',
        '--use-angle=swiftshader',
        '--disable-setuid-sandbox',
        '--disable-features=TranslateUI',
        '--disable-hang-monitor',
        '--disable-prompt-on-repost',
        '--disable-client-side-phishing-detection',
        '--disable-component-extensions-with-background-pages',
        '--disable-default-apps',
        '--disable-domain-reliability',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--no-sandbox',
        '--disable-dev-shm-usage'
      ]
    }
  },
  // Use manually downloaded ChromeDriver 138
  chromeDriver: process.env.CHROMEDRIVER_PATH || path.join(__dirname, 'chromedriver.exe'),
  directConnect: true,
  baseUrl: 'http://localhost:4201/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 180000, // Increased from 180000
    print: function() {}
  },
  beforeLaunch: function() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    
    // Disable webdriver-manager updates to prevent conflicts
    process.env.WEBDRIVER_MANAGER_GECKODRIVER = 'false';
    process.env.WEBDRIVER_MANAGER_CHROMEDRIVER = 'false';
  },
  onPrepare() {
    jasmine.getEnv().addReporter(new SpecReporter({ 
      spec: { 
        displayStacktrace: 'raw',
        displayDuration: true,
        displayErrorMessages: true
      } 
    }));
    
    // Add global error handling
    global.console.log = function(msg) {
      if (typeof msg === 'string' && msg.includes('ERROR')) {
        console.error(msg);
      } else {
        console.log(msg);
      }
    };
  },
  // Add better error handling
  onComplete: function() {
    // Clean up any remaining processes
    browser.quit();
  }
};
