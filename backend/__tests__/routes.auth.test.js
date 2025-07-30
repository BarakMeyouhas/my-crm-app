const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = require('../index');
const prisma = new PrismaClient();

describe('Auth Routes', () => {
  let testUser;
  let testCompany;
  let adminToken;
  let userToken;

  beforeAll(async () => {
    // Clean up test database
    await prisma.user.deleteMany();
    await prisma.company.deleteMany();
    
    // Create a test company
    testCompany = await prisma.company.create({
      data: {
        name: 'Test Company',
        contactEmail: 'test@company.com',
        contactPhone: '123-456-7890',
        subscriptionPlan: 'Basic'
      }
    });

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        passwordHash: hashedPassword,
        role: 'Employee',
        companyId: testCompany.id
      }
    });

    // Create an admin user
    const adminHashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        passwordHash: adminHashedPassword,
        role: 'Admin',
        companyId: testCompany.id
      }
    });

    // Generate tokens
    adminToken = jwt.sign(
      { userId: adminUser.id, role: 'Admin' },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );

    userToken = jwt.sign(
      { userId: testUser.id, role: 'Employee' },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.company.deleteMany();
    await prisma.$disconnect();
  });

  describe('GET /api/profile', () => {
    it('should return user profile when authenticated', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', 'test@example.com');
      expect(response.body).toHaveProperty('role', 'Employee');
      expect(response.body).toHaveProperty('firstName', 'John');
      expect(response.body).toHaveProperty('lastName', 'Doe');
      expect(response.body).toHaveProperty('companyId');
      expect(response.body).toHaveProperty('companyName', 'Test Company');
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .get('/api/profile');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Missing token');
    });

    it('should return 403 when token is invalid', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Invalid or expired token');
    });

    it('should return 404 when user not found', async () => {
      const nonExistentToken = jwt.sign(
        { userId: 99999, role: 'Employee' },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${nonExistentToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'User not found');
    });
  });

  describe('GET /api/admin/users', () => {
    it('should return all users when admin is authenticated', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const user = response.body.find(u => u.email === 'test@example.com');
      expect(user).toBeDefined();
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('role');
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .get('/api/admin/users');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Missing token');
    });

    it('should return 403 when non-admin user tries to access', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Access denied: insufficient role');
    });

    it('should return 403 when token is invalid', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Invalid or expired token');
    });
  });

  describe('DELETE /api/admin/users/:id', () => {
    it('should delete user when admin is authenticated', async () => {
      // Create a user to delete
      const userToDelete = await prisma.user.create({
        data: {
          email: 'delete@example.com',
          firstName: 'Delete',
          lastName: 'User',
          passwordHash: await bcrypt.hash('password123', 10),
          role: 'Employee',
          companyId: testCompany.id
        }
      });

      const response = await request(app)
        .delete(`/api/admin/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(204);

      // Verify user was deleted
      const deletedUser = await prisma.user.findUnique({
        where: { id: userToDelete.id }
      });
      expect(deletedUser).toBeNull();
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .delete('/api/admin/users/1');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Missing token');
    });

    it('should return 403 when non-admin user tries to delete', async () => {
      const response = await request(app)
        .delete('/api/admin/users/1')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Access denied: insufficient role');
    });

    it('should return 500 when trying to delete non-existent user', async () => {
      const response = await request(app)
        .delete('/api/admin/users/99999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Error deleting user');
    });

    it('should return 403 when token is invalid', async () => {
      const response = await request(app)
        .delete('/api/admin/users/1')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Invalid or expired token');
    });
  });
}); 