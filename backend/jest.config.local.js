module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.test.js'
  ],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/generated/**',
    '!jest.config.js',
    '!jest.config.local.js',
    '!setup-test-db.js'
  ],
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/generated/'
  ],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup-local.js'],
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true
}; 