const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupLocalTestEnvironment() {
  console.log('🔧 Setting up local test environment...');
  
  try {
    // Set test environment variables for local PostgreSQL
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5433/servix_db_test';
    
    // Check if PostgreSQL is running locally
    console.log('📡 Checking local PostgreSQL connection...');
    await prisma.$connect();
    console.log('✅ Local PostgreSQL connection successful');
    
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
    console.error('❌ Error setting up local test environment:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Install PostgreSQL locally: https://www.postgresql.org/download/');
    console.log('2. Start PostgreSQL service');
    console.log('3. Verify connection: psql -h localhost -p 5432 -U postgres');
    console.log('4. Check if user "postgres" with password "postgres" exists');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function runLocalTests() {
  console.log('🧪 Running tests with local PostgreSQL...');
  
  try {
    execSync('jest --config=jest.config.local.js --verbose', { 
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
  console.log('🚀 Starting comprehensive test suite with local PostgreSQL...\n');
  
  await setupLocalTestEnvironment();
  await runLocalTests();
  
  console.log('\n🎉 Test suite completed!');
}

if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = { setupLocalTestEnvironment, runLocalTests }; 