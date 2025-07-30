// Test setup file for LOCAL PostgreSQL (no Docker)
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
// Use local PostgreSQL installation on port 5433
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5433/servix_db_test';

// Increase timeout for database operations
jest.setTimeout(30000);

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Global test cleanup
afterAll(async () => {
  // Add a small delay to ensure all connections are closed
  await new Promise(resolve => setTimeout(resolve, 1000));
}); 