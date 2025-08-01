const request = require('supertest');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const app = require('../index');

const prisma = new PrismaClient();

describe('Auth Routes', () => {
  let userToken, adminToken, testUser, testCompany;

  beforeAll(async () => {
    // Create test company
    testCompany = await prisma.company.create({
      data: {
        name: 'Test Company',
        contactEmail: 'test@company.com',
        contactPhone: '123-456-7890',
        subscriptionPlan: 'Basic'
      }
    });

    // Create test user (Employee)
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        passwordHash: '$2b$10$test.hash.for.testing',
        role: 'Employee',
        companyId: testCompany.id
      }
    });

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        passwordHash: '$2b$10$test.hash.for.testing',
        role: 'Admin',
        companyId: testCompany.id
      }
    });

    // Generate tokens
    userToken = jwt.sign(
      { userId: testUser.id, role: 'Employee' },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );

    adminToken = jwt.sign(
      { userId: adminUser.id, role: 'Admin' },
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
      const userToDelete = await prisma.user.create({
        data: {
          email: 'delete@example.com',
          firstName: 'Delete',
          lastName: 'User',
          passwordHash: '$2b$10$test.hash.for.testing',
          role: 'Employee',
          companyId: testCompany.id
        }
      });

      const response = await request(app)
        .delete(`/api/admin/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(204);
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

    it('should return 403 when token is invalid', async () => {
      const response = await request(app)
        .delete('/api/admin/users/1')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Invalid or expired token');
    });

    it('should return 500 when trying to delete non-existent user', async () => {
      const response = await request(app)
        .delete('/api/admin/users/99999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Error deleting user');
    });
  });
}); 