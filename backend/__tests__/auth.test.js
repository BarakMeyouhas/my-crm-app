const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const app = require('../index');
const prisma = new PrismaClient();

describe('Auth API', () => {
  beforeAll(async () => {
    // Clean up test database
    await prisma.user.deleteMany();
    await prisma.company.deleteMany();
    
    // Create a test company
    await prisma.company.create({
      data: {
        name: 'Test Company',
        contactEmail: 'test@company.com',
        contactPhone: '123-456-7890',
        subscriptionPlan: 'Basic'
      }
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.company.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const company = await prisma.company.findFirst();
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          company: { companyId: company.id.toString() },
          user: {
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123',
            role: 'Admin'
          }
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('companyId');
    });

    it('should return 400 if user already exists', async () => {
      const company = await prisma.company.findFirst();
      
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          company: { companyId: company.id.toString() },
          user: {
            email: 'duplicate@example.com',
            firstName: 'Jane',
            lastName: 'Doe',
            password: 'password123',
            role: 'Admin'
          }
        });

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          company: { companyId: company.id.toString() },
          user: {
            email: 'duplicate@example.com',
            firstName: 'Jane',
            lastName: 'Doe',
            password: 'password123',
            role: 'Admin'
          }
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Clean up users before each test
      await prisma.user.deleteMany();
      
      // Create a test user
      const company = await prisma.company.findFirst();
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      await prisma.user.create({
        data: {
          email: 'login@example.com',
          firstName: 'Login',
          lastName: 'User',
          passwordHash: hashedPassword,
          role: 'Admin',
          companyId: company.id
        }
      });
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('role');
      expect(response.body).toHaveProperty('message', 'Login successful');
    });

    it('should return 401 with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should return 401 with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });
  });
}); 