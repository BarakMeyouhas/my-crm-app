const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = require('../index');
const prisma = new PrismaClient();

describe('Service Requests Routes', () => {
  let testUser;
  let testCompany;
  let authToken;

  beforeAll(async () => {
    // Clean up test database
    await prisma.serviceRequest.deleteMany();
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

    // Generate authentication token
    authToken = jwt.sign(
      { userId: testUser.id, role: 'Employee' },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await prisma.serviceRequest.deleteMany();
    await prisma.user.deleteMany();
    await prisma.company.deleteMany();
    await prisma.$disconnect();
  });

  describe('GET /api/service-requests', () => {
    beforeEach(async () => {
      // Clean up service requests before each test
      await prisma.serviceRequest.deleteMany();
    });

    it('should return all service requests when no companyId is provided', async () => {
      // Create test service requests with a delay to ensure proper ordering
      await prisma.serviceRequest.create({
        data: {
          title: 'Test Request 1',
          description: 'Description 1',
          status: 'PENDING',
          companyId: testCompany.id,
          createdById: testUser.id
        }
      });

      // Add a small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));

      await prisma.serviceRequest.create({
        data: {
          title: 'Test Request 2',
          description: 'Description 2',
          status: 'IN_PROGRESS',
          companyId: testCompany.id,
          createdById: testUser.id
        }
      });

      const response = await request(app)
        .get('/api/service-requests')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      
      // Check that requests are ordered by createdAt desc
      expect(response.body[0].title).toBe('Test Request 2');
      expect(response.body[1].title).toBe('Test Request 1');
      
      // Check that includes are working
      expect(response.body[0]).toHaveProperty('company');
      expect(response.body[0]).toHaveProperty('createdBy');
    });

    it('should return service requests filtered by companyId', async () => {
      // Create another company
      const otherCompany = await prisma.company.create({
        data: {
          name: 'Other Company',
          contactEmail: 'other@company.com',
          contactPhone: '987-654-3210',
          subscriptionPlan: 'Basic'
        }
      });

      // Create service requests for both companies
      await prisma.serviceRequest.create({
        data: {
          title: 'Company 1 Request',
          description: 'Description for company 1',
          status: 'PENDING',
          companyId: testCompany.id,
          createdById: testUser.id
        }
      });

      await prisma.serviceRequest.create({
        data: {
          title: 'Company 2 Request',
          description: 'Description for company 2',
          status: 'PENDING',
          companyId: otherCompany.id,
          createdById: testUser.id
        }
      });

      const response = await request(app)
        .get('/api/service-requests')
        .query({ companyId: testCompany.id })
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe('Company 1 Request');
    });

    it('should return empty array when no service requests exist', async () => {
      const response = await request(app)
        .get('/api/service-requests')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('POST /api/service-requests', () => {
    it('should create a new service request with all required fields', async () => {
      const serviceRequestData = {
        title: 'New Service Request',
        description: 'This is a test service request',
        status: 'PENDING',
        dueDate: '2024-12-31',
        companyId: testCompany.id,
        createdById: testUser.id
      };

      const response = await request(app)
        .post('/api/service-requests')
        .send(serviceRequestData)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', 'New Service Request');
      expect(response.body).toHaveProperty('description', 'This is a test service request');
      expect(response.body).toHaveProperty('status', 'PENDING');
      expect(response.body).toHaveProperty('companyId', testCompany.id);
      expect(response.body).toHaveProperty('createdById', testUser.id);
      expect(response.body).toHaveProperty('company');
      expect(response.body).toHaveProperty('createdBy');
    });

    it('should create a service request with default status when not provided', async () => {
      const serviceRequestData = {
        title: 'Service Request with Default Status',
        description: 'This request should have PENDING status',
        companyId: testCompany.id,
        createdById: testUser.id
      };

      const response = await request(app)
        .post('/api/service-requests')
        .send(serviceRequestData)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('status', 'PENDING');
    });

    it('should create a service request without due date', async () => {
      const serviceRequestData = {
        title: 'Service Request without Due Date',
        description: 'This request has no due date',
        companyId: testCompany.id,
        createdById: testUser.id
      };

      const response = await request(app)
        .post('/api/service-requests')
        .send(serviceRequestData)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('dueDate', null);
    });

    it('should return 400 when title is missing', async () => {
      const serviceRequestData = {
        description: 'This request has no title',
        companyId: testCompany.id,
        createdById: testUser.id
      };

      const response = await request(app)
        .post('/api/service-requests')
        .send(serviceRequestData)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('title');
    });

    it('should return 400 when description is missing', async () => {
      const serviceRequestData = {
        title: 'Request without description',
        companyId: testCompany.id,
        createdById: testUser.id
      };

      const response = await request(app)
        .post('/api/service-requests')
        .send(serviceRequestData)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('description');
    });

    it('should return 400 when companyId is missing', async () => {
      const serviceRequestData = {
        title: 'Request without company',
        description: 'This request has no company',
        createdById: testUser.id
      };

      const response = await request(app)
        .post('/api/service-requests')
        .send(serviceRequestData)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('companyId');
    });

    it('should return 400 when createdById is missing', async () => {
      const serviceRequestData = {
        title: 'Request without creator',
        description: 'This request has no creator',
        companyId: testCompany.id
      };

      const response = await request(app)
        .post('/api/service-requests')
        .send(serviceRequestData)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('createdById');
    });

    it('should return 400 when multiple required fields are missing', async () => {
      const serviceRequestData = {
        title: 'Request with missing fields'
      };

      const response = await request(app)
        .post('/api/service-requests')
        .send(serviceRequestData)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('description');
      expect(response.body.message).toContain('companyId');
      expect(response.body.message).toContain('createdById');
    });
  });
}); 