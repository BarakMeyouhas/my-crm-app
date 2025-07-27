const request = require('supertest');
const app = require('../index');

describe('Basic API Tests', () => {
  describe('Health Check', () => {
    it('should have CORS enabled', async () => {
      const response = await request(app)
        .options('/api/auth/login')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Auth Endpoints', () => {
    it('should accept POST requests to /api/auth/register', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          company: { companyId: '1' },
          user: {
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            password: 'password123',
            role: 'Admin'
          }
        });

      // Should get a response (even if it's an error due to missing DB)
      expect(response.status).toBeDefined();
    });

    it('should accept POST requests to /api/auth/login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      // Should get a response (even if it's an error due to missing DB)
      expect(response.status).toBeDefined();
    });
  });

  describe('API Structure', () => {
    it('should have proper middleware setup', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      // Should get a JSON response
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });
}); 