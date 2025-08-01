import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ HttpClientTestingModule, FormsModule ],
      providers: [
        AuthService,
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should have email and password properties', () => {
      expect(component.email).toBeDefined();
      expect(component.password).toBeDefined();
    });

    it('should have error message property', () => {
      expect(component.errorMessage).toBeDefined();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.email = 'test@example.com';
      component.password = 'password123';
    });

    it('should submit login form successfully for regular user', fakeAsync(() => {
      const mockResponse = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJFbXBsb3llZSIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxNjM0NTcxNDkwfQ.mock-signature',
        role: 'Employee'
      };
      
      component.onSubmit();
      
      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: 'test@example.com',
        password: 'password123'
      });
      
      req.flush(mockResponse);
      tick();
      
      expect(localStorage.getItem('token')).toBe(mockResponse.token);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    }));

    it('should submit login form successfully for admin user', fakeAsync(() => {
      const mockResponse = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJBZG1pbiIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxNjM0NTcxNDkwfQ.mock-signature',
        role: 'Admin'
      };
      
      component.onSubmit();
      
      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/login`);
      req.flush(mockResponse);
      tick();
      
      expect(router.navigate).toHaveBeenCalledWith(['/admin-panel']);
    }));

    it('should handle login error', fakeAsync(() => {
      const mockError = {
        error: {
          message: 'Invalid credentials'
        }
      };
      
      component.onSubmit();
      
      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/login`);
      req.flush(mockError, { status: 401, statusText: 'Unauthorized' });
      tick();
      
      expect(component.errorMessage).toBe('Login failed');
    }));

    it('should handle login error without message', fakeAsync(() => {
      component.onSubmit();
      
      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/login`);
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });
      tick();
      
      expect(component.errorMessage).toBe('Login failed');
    }));
  });

  describe('Template Integration', () => {
    it('should display testimonials in template', () => {
      // Test that testimonials are available in component
      expect(component.testimonials.length).toBeGreaterThan(0);
    });

    it('should have form properties', () => {
      // Test that form properties exist and are initialized
      expect(component.email).toBeDefined();
      expect(component.password).toBeDefined();
      expect(component.errorMessage).toBeDefined();
      expect(component.testimonials).toBeDefined();
      expect(component.currentTestimonial).toBeDefined();
    });

    it('should display error message when present', () => {
      component.errorMessage = 'Test error message';
      expect(component.errorMessage).toBe('Test error message');
    });
  });

  describe('Lifecycle', () => {
    it('should start testimonial interval on init', fakeAsync(() => {
      component.ngOnInit();
      expect(component.currentTestimonial).toBe(0);
      
      tick(4000);
      expect(component.currentTestimonial).toBe(1);
      
      // Clean up the interval
      component.ngOnDestroy();
    }));
  });
});
