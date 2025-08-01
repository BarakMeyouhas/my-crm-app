import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

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
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('login', () => {
    it('should login successfully and store token', () => {
      const loginData = { email: 'test@example.com', password: 'password123' };
      const mockResponse = {
        message: 'Login successful',
        token: 'test-token',
        role: 'Admin'
      };

      service.login(loginData.email, loginData.password).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('token')).toBe('test-token');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginData);
      req.flush(mockResponse);
    });

    it('should handle login error', () => {
      const loginData = { email: 'test@example.com', password: 'wrongpassword' };

      service.login(loginData.email, loginData.password).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/login`);
      req.flush('Invalid credentials', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('getAllUsers', () => {
    it('should fetch all users with auth token', () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com', role: 'Admin' },
        { id: 2, email: 'user2@example.com', role: 'Employee' }
      ];

      localStorage.setItem('token', 'test-token');

      service.getAllUsers().subscribe(users => {
        expect(users).toEqual(mockUsers);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/admin/users`);
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

      const req = httpMock.expectOne(`${environment.apiUrl}/api/admin/users`);
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

      const req = httpMock.expectOne(`${environment.apiUrl}/api/profile`);
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

      const req = httpMock.expectOne(`${environment.apiUrl}/api/profile`);
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

      const req = httpMock.expectOne(`${environment.apiUrl}/api/admin/users/${userId}`);
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

      const req = httpMock.expectOne(`${environment.apiUrl}/api/admin/users/${userId}`);
      req.flush('User not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('register', () => {
    it('should register user successfully', () => {
      const registerData = {
        company: { companyId: 1 },
        user: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123',
          role: 'Admin'
        }
      };
      const mockResponse = {
        message: 'User registered successfully',
        userId: 1,
        companyId: 1
      };

      service.register(registerData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerData);
      req.flush(mockResponse);
    });

    it('should handle registration error', () => {
      const registerData = {
        company: { companyId: 1 },
        user: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'existing@example.com',
          password: 'password123',
          role: 'Admin'
        }
      };

      service.register(registerData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/register`);
      req.flush('User already exists', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('logout', () => {
    it('should clear token and reset current user', () => {
      localStorage.setItem('token', 'test-token');
      service.logout();

      expect(localStorage.getItem('token')).toBeNull();

      service.currentUser.subscribe(user => {
        expect(user).toBeNull();
      });
    });
  });

  describe('token getter', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      expect(service.token).toBe('test-token');
    });

    it('should return null when no token exists', () => {
      expect(service.token).toBeNull();
    });
  });
});
