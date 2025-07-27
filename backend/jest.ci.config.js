module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/api-structure.test.js',
    '**/__tests__/simple.test.js'
  ],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/generated/**',
    '!jest.config.js',
    '!jest.ci.config.js',
    '!setup-test-db.js'
  ],
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/generated/'
  ],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  testTimeout: 15000,
  forceExit: true,
  detectOpenHandles: true
}; 