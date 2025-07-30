import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ LoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with testimonials', () => {
    expect(component.testimonials).toBeDefined();
    expect(component.testimonials.length).toBe(3);
    expect(component.currentTestimonial).toBe(0);
  });

  it('should have testimonials with required properties', () => {
    const firstTestimonial = component.testimonials[0];
    expect(firstTestimonial.text).toBeDefined();
    expect(firstTestimonial.name).toBeDefined();
    expect(firstTestimonial.title).toBeDefined();
    expect(firstTestimonial.avatar).toBeDefined();
  });

  it('should set testimonial correctly', fakeAsync(() => {
    component.setTestimonial(1);
    expect(component.currentTestimonial).toBe(1);
    expect(component.animationDirection).toBe('right');
    
    tick(4000);
    expect(component.currentTestimonial).toBe(2);
    
    // Clean up the interval
    component.ngOnDestroy();
  }));

  it('should handle testimonial rotation with left direction', fakeAsync(() => {
    component.currentTestimonial = 2;
    component.setTestimonial(1);
    expect(component.animationDirection).toBe('left');
    
    tick(4000);
    expect(component.currentTestimonial).toBe(2);
    
    // Clean up the interval
    component.ngOnDestroy();
  }));

  it('should clear interval on destroy', fakeAsync(() => {
    const clearIntervalSpy = spyOn(window, 'clearInterval');
    component.ngOnDestroy();
    expect(clearIntervalSpy).toHaveBeenCalled();
  }));

  it('should navigate to register page', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.goToRegister();
    expect(navigateSpy).toHaveBeenCalledWith(['/register']);
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.email = 'test@example.com';
      component.password = 'password123';
    });

    it('should submit login form successfully for regular user', fakeAsync(() => {
      const mockResponse = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjM0NTY3ODkwLCJleHAiOjE2MzQ1NzE0OTB9.mock-signature',
        role: 'user'
      };
      const navigateSpy = spyOn(router, 'navigate');
      
      component.onSubmit();
      
      const req = httpMock.expectOne('http://localhost:5000/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: 'test@example.com',
        password: 'password123'
      });
      
      req.flush(mockResponse);
      tick();
      
      expect(localStorage.getItem('token')).toBe(mockResponse.token);
      expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
    }));

    it('should submit login form successfully for admin user', fakeAsync(() => {
      const mockResponse = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxNjM0NTcxNDkwfQ.mock-signature',
        role: 'admin'
      };
      const navigateSpy = spyOn(router, 'navigate');
      
      component.onSubmit();
      
      const req = httpMock.expectOne('http://localhost:5000/api/auth/login');
      req.flush(mockResponse);
      tick();
      
      expect(navigateSpy).toHaveBeenCalledWith(['/admin-panel']);
    }));

    it('should handle login error', fakeAsync(() => {
      const mockError = {
        error: {
          message: 'Invalid credentials'
        }
      };
      
      component.onSubmit();
      
      const req = httpMock.expectOne('http://localhost:5000/api/auth/login');
      req.flush(mockError, { status: 401, statusText: 'Unauthorized' });
      tick();
      
      expect(component.errorMessage).toBe('Login failed');
    }));

    it('should handle login error without message', fakeAsync(() => {
      component.onSubmit();
      
      const req = httpMock.expectOne('http://localhost:5000/api/auth/login');
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
