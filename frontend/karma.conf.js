// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        timeoutInterval: 10000 // Increase timeout to 10 seconds
      }
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/frontend'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      }
    },
    singleRun: false,
    restartOnFileChange: true,
    captureTimeout: 60000, // Increase capture timeout to 60 seconds
    browserDisconnectTimeout: 10000, // Increase disconnect timeout
    browserDisconnectTolerance: 3, // Allow 3 disconnects before failing
    browserNoActivityTimeout: 30000, // Increase no activity timeout to 30 seconds
    failOnEmptyTestSuite: false, // Don't fail if no tests are found
    client: {
      clearContext: false,
      jasmine: {
        timeoutInterval: 10000,
        random: false, // Disable random test execution for stability
        seed: null
      }
    }
  });
};
