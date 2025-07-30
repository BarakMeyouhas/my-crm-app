const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupTestEnvironment() {
  console.log('🔧 Setting up test environment...');
  
  try {
    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5433/servix_db_test';
    
    // Check if PostgreSQL is running
    console.log('📡 Checking PostgreSQL connection...');
    await prisma.$connect();
    console.log('✅ PostgreSQL connection successful');
    
    // Clean up test database
    console.log('🧹 Cleaning up test database...');
    await prisma.serviceRequest.deleteMany();
    await prisma.user.deleteMany();
    await prisma.company.deleteMany();
    console.log('✅ Test database cleaned up');
    
    // Run migrations
    console.log('📦 Running database migrations...');
    execSync('npx prisma migrate deploy', { 
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: 'postgresql://postgres:postgres@localhost:5433/servix_db_test' }
    });
    console.log('✅ Database migrations completed');
    
  } catch (error) {
    console.error('❌ Error setting up test environment:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure PostgreSQL is running: docker-compose up -d postgres');
    console.log('2. Check if port 5433 is accessible');
    console.log('3. Verify database credentials');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function runTests() {
  console.log('🧪 Running tests...');
  
  try {
    execSync('jest --verbose', { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'test' }
    });
    console.log('✅ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Tests failed:', error.message);
    process.exit(1);
  }
}

async function main() {
  console.log('🚀 Starting comprehensive test suite...\n');
  
  await setupTestEnvironment();
  await runTests();
  
  console.log('\n🎉 Test suite completed!');
}

if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = { setupTestEnvironment, runTests }; 