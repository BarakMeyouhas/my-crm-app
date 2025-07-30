const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupTestDatabase() {
  try {
    console.log('Setting up test database...');
    
    // Clean up existing data
    await prisma.serviceRequest.deleteMany();
    await prisma.user.deleteMany();
    await prisma.company.deleteMany();
    
    console.log('Test database cleaned up successfully');
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  setupTestDatabase()
    .then(() => {
      console.log('Test database setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Test database setup failed:', error);
      process.exit(1);
    });
}

module.exports = setupTestDatabase; 