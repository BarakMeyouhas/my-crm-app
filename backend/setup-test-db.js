const { PrismaClient } = require('@prisma/client');

async function setupTestDatabase() {
  console.log('Setting up test database...');
  
  // Use the test database URL
  const testDbUrl = 'postgresql://postgres:postgres@localhost:5432/servix_db_test';
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: testDbUrl
      }
    }
  });

  try {
    console.log('Connecting to PostgreSQL...');
    
    // Test the connection
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL successfully');
    
    // Push the schema to the test database
    console.log('Pushing schema to test database...');
    await prisma.$executeRaw`DROP SCHEMA IF EXISTS public CASCADE`;
    await prisma.$executeRaw`CREATE SCHEMA public`;
    
    console.log('✅ Test database setup complete!');
    console.log('You can now run: npm test');
    
  } catch (error) {
    console.error('❌ Error setting up test database:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure PostgreSQL is running on localhost:5432');
    console.log('2. Check if user "postgres" with password "postgres" exists');
    console.log('3. Try creating the database manually:');
    console.log('   psql -U postgres -c "CREATE DATABASE servix_db_test;"');
    console.log('4. Or update the DATABASE_URL in __tests__/setup.js with your credentials');
  } finally {
    await prisma.$disconnect();
  }
}

setupTestDatabase(); 