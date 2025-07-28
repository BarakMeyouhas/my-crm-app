// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 11000,
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
        '--user-data-dir=/tmp/chrome_profile_e2e_' + Math.random().toString(36).substring(7) + '_' + Date.now(),
        '--incognito',
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-sync',
        '--disable-translate',
        '--hide-scrollbars',
        '--mute-audio',
        '--no-first-run',
        '--safebrowsing-disable-auto-update',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
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
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-backgrounding-occluded-windows',
        '--disable-ipc-flooding-protection',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-sync',
        '--disable-translate',
        '--hide-scrollbars',
        '--mute-audio',
        '--no-first-run',
        '--safebrowsing-disable-auto-update',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
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
        '--use-mock-keychain'
      ]
    }
  },
  chromeDriver: '/usr/local/bin/chromedriver',
  directConnect: true,
  baseUrl: 'http://localhost:4201/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  beforeLaunch: function() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
  },
  onPrepare() {
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};
