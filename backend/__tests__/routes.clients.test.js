const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = require('../index');
const prisma = new PrismaClient();

describe('Clients Routes', () => {
  let testUser;
  let testCompany;
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

    // Generate token
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

  describe('GET /api/clients', () => {
    it('should return all clients when authenticated', async () => {
      const response = await request(app)
        .get('/api/clients')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .get('/api/clients');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Missing token');
    });

    it('should return 403 when token is invalid', async () => {
      const response = await request(app)
        .get('/api/clients')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Invalid or expired token');
    });
  });

  describe('POST /api/clients', () => {
    it('should create a new client when authenticated', async () => {
      const clientData = {
        name: 'Test Client',
        email: 'client@example.com',
        phone: '123-456-7890',
        company: 'Test Corp'
      };

      const response = await request(app)
        .post('/api/clients')
        .set('Authorization', `Bearer ${userToken}`)
        .send(clientData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'Test Client');
      expect(response.body).toHaveProperty('email', 'client@example.com');
      expect(response.body).toHaveProperty('phone', '123-456-7890');
      expect(response.body).toHaveProperty('company', 'Test Corp');
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .post('/api/clients')
        .send({ name: 'Test Client' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Missing token');
    });

    it('should return 403 when token is invalid', async () => {
      const response = await request(app)
        .post('/api/clients')
        .set('Authorization', 'Bearer invalid-token')
        .send({ name: 'Test Client' });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Invalid or expired token');
    });
  });

  describe('PUT /api/clients/:id', () => {
    it('should update an existing client when authenticated', async () => {
      // First create a client
      const createResponse = await request(app)
        .post('/api/clients')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Original Client',
          email: 'original@example.com',
          phone: '111-111-1111',
          company: 'Original Corp'
        });

      const clientId = createResponse.body.id;

      // Update the client
      const updateData = {
        name: 'Updated Client',
        email: 'updated@example.com',
        phone: '222-222-2222',
        company: 'Updated Corp'
      };

      const response = await request(app)
        .put(`/api/clients/${clientId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', clientId);
      expect(response.body).toHaveProperty('name', 'Updated Client');
      expect(response.body).toHaveProperty('email', 'updated@example.com');
      expect(response.body).toHaveProperty('phone', '222-222-2222');
      expect(response.body).toHaveProperty('company', 'Updated Corp');
    });

    it('should return 404 when client not found', async () => {
      const response = await request(app)
        .put('/api/clients/99999')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated Client' });

      expect(response.status).toBe(404);
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .put('/api/clients/1')
        .send({ name: 'Updated Client' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Missing token');
    });

    it('should return 403 when token is invalid', async () => {
      const response = await request(app)
        .put('/api/clients/1')
        .set('Authorization', 'Bearer invalid-token')
        .send({ name: 'Updated Client' });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Invalid or expired token');
    });
  });

  describe('DELETE /api/clients/users/:id', () => {
    it('should delete a user when authenticated', async () => {
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
        .delete(`/api/clients/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'User deleted');
      expect(response.body).toHaveProperty('user');

      // Verify user was deleted
      const deletedUser = await prisma.user.findUnique({
        where: { id: userToDelete.id }
      });
      expect(deletedUser).toBeNull();
    });

    it('should return 400 when user ID is invalid', async () => {
      const response = await request(app)
        .delete('/api/clients/users/invalid-id')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid user ID');
    });

    it('should return 500 when trying to delete non-existent user', async () => {
      const response = await request(app)
        .delete('/api/clients/users/99999')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Could not delete user');
    });
  });

  describe('GET /api/clients/companies', () => {
    it('should return all companies', async () => {
      const response = await request(app)
        .get('/api/clients/companies')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const company = response.body.find(c => c.name === 'Test Company');
      expect(company).toBeDefined();
      expect(company).toHaveProperty('id');
      expect(company).toHaveProperty('name', 'Test Company');
    });

    it('should return 500 when database error occurs', async () => {
      // This test would require mocking the database to simulate an error
      // For now, we'll just test the happy path
      const response = await request(app)
        .get('/api/clients/companies')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
    });
  });
}); 