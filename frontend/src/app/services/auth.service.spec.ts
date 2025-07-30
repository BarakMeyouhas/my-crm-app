import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, User } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('token getter', () => {
    it('should return null when no token is stored', () => {
      expect(service.token).toBeNull();
    });

    it('should return stored token', () => {
      const testToken = 'test-token';
      localStorage.setItem('token', testToken);
      expect(service.token).toBe(testToken);
    });
  });

  describe('currentUser', () => {
    it('should return observable of current user', (done) => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'Admin'
      };

      service.currentUser.subscribe(user => {
        expect(user).toBeNull(); // Initially null
        done();
      });
    });
  });

  describe('getAllUsers', () => {
    it('should fetch all users with auth token', () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com', role: 'Admin' },
        { id: 2, email: 'user2@example.com', role: 'User' }
      ];

      localStorage.setItem('token', 'test-token');

      service.getAllUsers().subscribe(users => {
        expect(users).toEqual(mockUsers);
      });

      const req = httpMock.expectOne('http://localhost:5000/api/admin/users');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush(mockUsers);
    });

    it('should handle error when fetching users fails', () => {
      localStorage.setItem('token', 'test-token');

      service.getAllUsers().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne('http://localhost:5000/api/admin/users');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('fetchUserProfile', () => {
    it('should fetch user profile and update current user', () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        role: 'Admin',
        firstName: 'John',
        lastName: 'Doe',
        companyId: 1,
        companyName: 'Test Company'
      };

      localStorage.setItem('token', 'test-token');

      service.fetchUserProfile().subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne('http://localhost:5000/api/profile');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush(mockUser);

      // Verify currentUser observable is updated
      service.currentUser.subscribe(user => {
        expect(user).toEqual(mockUser);
      });
    });

    it('should handle error when fetching profile fails', () => {
      localStorage.setItem('token', 'test-token');

      service.fetchUserProfile().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne('http://localhost:5000/api/profile');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('deleteUser', () => {
    it('should delete user with auth token', () => {
      const userId = 1;
      const mockResponse = { message: 'User deleted successfully' };

      localStorage.setItem('token', 'test-token');

      service.deleteUser(userId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/admin/users/${userId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush(mockResponse);
    });

    it('should throw error when no token is available', () => {
      const userId = 1;

      expect(() => {
        service.deleteUser(userId).subscribe();
      }).toThrowError('No auth token found');
    });

    it('should handle error when deleting user fails', () => {
      const userId = 1;
      localStorage.setItem('token', 'test-token');

      service.deleteUser(userId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/admin/users/${userId}`);
      req.flush('User not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('register', () => {
    it('should register new user', () => {
      const userData = {
        company: { companyId: '1' },
        user: {
          email: 'newuser@example.com',
          firstName: 'New',
          lastName: 'User',
          password: 'password123',
          role: 'User'
        }
      };

      const mockResponse = {
        message: 'User registered successfully',
        userId: 1,
        companyId: 1
      };

      service.register(userData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:5000/api/auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(userData);
      req.flush(mockResponse);
    });

    it('should handle registration error', () => {
      const userData = {
        company: { companyId: '1' },
        user: {
          email: 'existing@example.com',
          firstName: 'Existing',
          lastName: 'User',
          password: 'password123',
          role: 'User'
        }
      };

      service.register(userData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne('http://localhost:5000/api/auth/register');
      req.flush('User already exists', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('logout', () => {
    it('should clear token and reset current user', () => {
      localStorage.setItem('token', 'test-token');
      
      // Set up a mock user in the service
      const mockUser = { id: 1, name: 'Test User', email: 'test@example.com', role: 'Admin' };
      service['userSubject'].next(mockUser);

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      
      service.currentUser.subscribe(user => {
        expect(user).toBeNull();
      });
    });
  });
});
