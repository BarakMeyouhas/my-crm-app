// Protractor configuration file for local development
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
const path = require('path');
const os = require('os');

// Detect platform and set appropriate ChromeDriver path
const isWindows = os.platform() === 'win32';
const chromedriverName = isWindows ? 'chromedriver.exe' : 'chromedriver';
const chromedriverPath = process.env.CHROMEDRIVER_PATH || 
  (isWindows ? path.join(__dirname, chromedriverName) : '/usr/bin/chromedriver');

exports.config = {
  allScriptsTimeout: 180000,
  getPageTimeout: 60000,
  SELENIUM_PROMISE_MANAGER: false,
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
  chromeDriver: chromedriverPath,
  directConnect: true,
  baseUrl: 'http://localhost:4200/', // Changed to standard Angular port
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 180000,
    print: function() {}
  },
  troubleshoot: true,
  verbose: true,
  logLevel: 'DEBUG',
  beforeLaunch: function() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    
    console.log(`🌐 Platform: ${os.platform()}`);
    console.log(`🔧 ChromeDriver path: ${chromedriverPath}`);
    console.log(`🌐 Base URL: http://localhost:4200/`);
  },
  onPrepare() {
    jasmine.getEnv().addReporter(new SpecReporter({ 
      spec: { 
        displayStacktrace: 'raw',
        displayDuration: true,
        displayErrorMessages: true
      } 
    }));
    
    console.log('🔧 Protractor onPrepare started');
    console.log(`🌐 Base URL: ${exports.config.baseUrl}`);
    console.log(`🔧 ChromeDriver path: ${exports.config.chromeDriver}`);
    console.log(`📱 Platform: ${os.platform()}`);
  },
  onComplete: function() {
    browser.quit();
  }
}; 