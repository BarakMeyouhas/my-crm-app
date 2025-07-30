const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {},
      user: null
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  describe('authenticateToken', () => {
    it('should return 401 when no token is provided', () => {
      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Missing token' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header is malformed', () => {
      mockReq.headers.authorization = 'InvalidFormat';

      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Missing token' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when token is invalid', () => {
      mockReq.headers.authorization = 'Bearer invalid-token';

      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next() when token is valid', () => {
      const validToken = jwt.sign(
        { userId: 1, role: 'Admin' },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );
      mockReq.headers.authorization = `Bearer ${validToken}`;

      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.userId).toBe(1);
      expect(mockReq.user.role).toBe('Admin');
    });

    it('should return 403 when token is expired', () => {
      const expiredToken = jwt.sign(
        { userId: 1, role: 'Admin' },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '0s' }
      );
      mockReq.headers.authorization = `Bearer ${expiredToken}`;

      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('authorizeRoles', () => {
    it('should return 401 when no user is present', () => {
      const authorizeAdmin = authorizeRoles('Admin');
      
      authorizeAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when user role is not authorized', () => {
      mockReq.user = { userId: 1, role: 'Employee' };
      const authorizeAdmin = authorizeRoles('Admin');
      
      authorizeAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Access denied: insufficient role' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next() when user role is authorized', () => {
      mockReq.user = { userId: 1, role: 'Admin' };
      const authorizeAdmin = authorizeRoles('Admin');
      
      authorizeAdmin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should allow access for multiple roles', () => {
      mockReq.user = { userId: 1, role: 'Manager' };
      const authorizeMultiple = authorizeRoles('Admin', 'Manager', 'Supervisor');
      
      authorizeMultiple(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should deny access when user role is not in multiple allowed roles', () => {
      mockReq.user = { userId: 1, role: 'Employee' };
      const authorizeMultiple = authorizeRoles('Admin', 'Manager', 'Supervisor');
      
      authorizeMultiple(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Access denied: insufficient role' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
}); 