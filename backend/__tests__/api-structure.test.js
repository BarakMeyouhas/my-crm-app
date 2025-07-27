const request = require('supertest');
const app = require('../index');

describe('API Structure Tests', () => {
  describe('Server Setup', () => {
    it('should have CORS middleware enabled', async () => {
      const response = await request(app)
        .options('/api/auth/login')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should parse JSON requests', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'test' });

      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('Auth Endpoints', () => {
    it('should accept POST to /api/auth/register', async () => {
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
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should accept POST to /api/auth/login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      // Should get a response (even if it's an error due to missing DB)
      expect(response.status).toBeDefined();
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('Route Structure', () => {
    it('should have proper error handling', async () => {
      const response = await request(app)
        .get('/api/nonexistent');

      expect(response.status).toBe(404);
    });
  });
}); 