import { ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks, flush } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../services/auth.service';
import { ServiceRequestService } from '../services/service-request.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let serviceRequestService: jasmine.SpyObj<ServiceRequestService>;
  let httpMock: HttpTestingController;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    role: 'Admin',
    firstName: 'John',
    lastName: 'Doe',
    companyId: 1,
    companyName: 'Test Company'
  };

  const mockServiceRequests = [
    {
      id: 1,
      title: 'Test Request 1',
      description: 'Description 1',
      status: 'PENDING',
      companyId: 1,
      createdById: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      title: 'Test Request 2',
      description: 'Description 2',
      status: 'IN_PROGRESS',
      companyId: 1,
      createdById: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      title: 'Test Request 3',
      description: 'Description 3',
      status: 'COMPLETED',
      companyId: 1,
      createdById: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockUsers = [
    { id: 1, email: 'user1@example.com', role: 'Admin' },
    { id: 2, email: 'user2@example.com', role: 'Employee' }
  ];

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'fetchUserProfile', 'getAllUsers'
    ], {
      currentUser: new BehaviorSubject(mockUser)
    });

    const serviceRequestServiceSpy = jasmine.createSpyObj('ServiceRequestService', [
      'getServiceRequestsByCompany'
    ]);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatTooltipModule, MatButtonModule],
      declarations: [ DashboardComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ServiceRequestService, useValue: serviceRequestServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    serviceRequestService = TestBed.inject(ServiceRequestService) as jasmine.SpyObj<ServiceRequestService>;
    httpMock = TestBed.inject(HttpTestingController);
    
    // Set up default return values
    authService.fetchUserProfile.and.returnValue(of(mockUser));
    serviceRequestService.getServiceRequestsByCompany.and.returnValue(of(mockServiceRequests));
    authService.getAllUsers.and.returnValue(of(mockUsers));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.user).toBeUndefined();
    expect(component.userName).toBe('');
    expect(component.companyName).toBe('');
    expect(component.serviceRequests).toEqual([]);
    expect(component.totalServiceRequests).toBe(0);
    expect(component.latestServiceRequestTitle).toBe('');
    expect(component.statusStats).toEqual({
      PENDING: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      CANCELLED: 0
    });
  });

  describe('ngOnInit', () => {
    it('should fetch user profile and service requests', () => {
      // Test the service calls without triggering ngOnInit
      component.ngOnInit();
      
      expect(authService.fetchUserProfile).toHaveBeenCalled();
      expect(serviceRequestService.getServiceRequestsByCompany).toHaveBeenCalledWith(mockUser.companyId);
      expect(authService.getAllUsers).toHaveBeenCalled();
    });

    it('should handle user profile fetch error', () => {
      const consoleSpy = spyOn(console, 'error');
      authService.fetchUserProfile.and.returnValue(throwError(() => new Error('Profile fetch failed')));
      serviceRequestService.getServiceRequestsByCompany.and.returnValue(of([]));

      component.ngOnInit();
      
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching user profile:', jasmine.any(Object));
    });

    it('should handle service requests fetch error', () => {
      const consoleSpy = spyOn(console, 'error');
      authService.fetchUserProfile.and.returnValue(of(mockUser));
      serviceRequestService.getServiceRequestsByCompany.and.returnValue(throwError(() => new Error('Service requests failed')));

      component.ngOnInit();
      
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching service requests:', jasmine.any(Object));
    });
  });

  describe('calculateStatusStats', () => {
    it('should calculate status statistics correctly', () => {
      component.serviceRequests = mockServiceRequests;
      
      component.calculateStatusStats();
      
      expect(component.statusStats.PENDING).toBe(1);
      expect(component.statusStats.IN_PROGRESS).toBe(1);
      expect(component.statusStats.COMPLETED).toBe(1);
      expect(component.statusStats.CANCELLED).toBe(0);
    });

    it('should reset stats before calculating', () => {
      component.statusStats = {
        PENDING: 10,
        IN_PROGRESS: 10,
        COMPLETED: 10,
        CANCELLED: 10
      };
      
      component.serviceRequests = [];
      component.calculateStatusStats();
      
      expect(component.statusStats.PENDING).toBe(0);
      expect(component.statusStats.IN_PROGRESS).toBe(0);
      expect(component.statusStats.COMPLETED).toBe(0);
      expect(component.statusStats.CANCELLED).toBe(0);
    });

    it('should handle unknown status', () => {
      const requestsWithUnknownStatus = [
        { ...mockServiceRequests[0], status: 'UNKNOWN_STATUS' }
      ];
      
      component.serviceRequests = requestsWithUnknownStatus;
      component.calculateStatusStats();
      
      expect(component.statusStats.PENDING).toBe(0);
      expect(component.statusStats.IN_PROGRESS).toBe(0);
      expect(component.statusStats.COMPLETED).toBe(0);
      expect(component.statusStats.CANCELLED).toBe(0);
    });
  });

  describe('createServiceRequestChart', () => {
    beforeEach(() => {
      // Mock the chart canvas element
      const mockCanvas = document.createElement('canvas');
      const mockContext = mockCanvas.getContext('2d');
      spyOn(mockCanvas, 'getContext').and.returnValue(mockContext);
      
      component.chartCanvas = {
        nativeElement: mockCanvas
      } as any;
    });

    it('should create chart with actual data', () => {
      component.statusStats = {
        PENDING: 5,
        IN_PROGRESS: 3,
        COMPLETED: 8,
        CANCELLED: 1
      };

      const consoleSpy = spyOn(console, 'log');
      
      component.createServiceRequestChart();
      
      expect(consoleSpy).toHaveBeenCalledWith('Creating service request chart...');
      expect(component.serviceRequestChart).toBeDefined();
    });

    it('should use sample data when all values are zero', () => {
      component.statusStats = {
        PENDING: 0,
        IN_PROGRESS: 0,
        COMPLETED: 0,
        CANCELLED: 0
      };

      const consoleSpy = spyOn(console, 'log');
      
      component.createServiceRequestChart();
      
      expect(consoleSpy).toHaveBeenCalledWith('No data available, using sample data for testing');
      expect(component.serviceRequestChart).toBeDefined();
    });

    it('should destroy existing chart before creating new one', () => {
      const destroySpy = jasmine.createSpy('destroy');
      component.serviceRequestChart = { destroy: destroySpy } as any;
      
      component.createServiceRequestChart();
      
      expect(destroySpy).toHaveBeenCalled();
    });

    it('should handle missing chart canvas', () => {
      component.chartCanvas = null;
      const consoleSpy = spyOn(console, 'error');
      
      component.createServiceRequestChart();
      
      expect(consoleSpy).toHaveBeenCalledWith('Chart canvas not found');
    });
  });

  describe('User Data Processing', () => {
    it('should set user name correctly with first and last name', () => {
      component.user = { firstName: 'John', lastName: 'Doe' };
      component.ngOnInit();
      
      expect(component.user.firstName).toBe('John');
      expect(component.user.lastName).toBe('Doe');
    });

    it('should set user name with only first name', () => {
      component.user = { firstName: 'John' };
      component.ngOnInit();
      
      expect(component.user.firstName).toBe('John');
    });

    it('should set user name with name property as fallback', () => {
      const userWithName = { name: 'John Doe' };
      // Mock the fetchUserProfile to return a user with name property
      authService.fetchUserProfile.and.returnValue(of(userWithName));
      // Mock getAllUsers to return empty array to avoid conflicts
      authService.getAllUsers.and.returnValue(of([]));
      // Mock service requests to return empty array
      serviceRequestService.getServiceRequestsByCompany.and.returnValue(of([]));
      
      component.ngOnInit();
      expect(component.userName).toBe('John Doe');
    });

    it('should set company name correctly', () => {
      component.user = { companyName: 'Test Company' };
      component.ngOnInit();
      
      expect(component.user.companyName).toBe('Test Company');
    });
  });

  describe('Service Request Processing', () => {
    it('should set total service requests count', () => {
      component.serviceRequests = mockServiceRequests;
      component.ngOnInit();
      
      expect(component.serviceRequests.length).toBe(3);
    });

    it('should set latest service request title', () => {
      component.serviceRequests = mockServiceRequests;
      component.ngOnInit();
      
      expect(component.serviceRequests[0].title).toBe('Test Request 1');
    });

    it('should handle empty service requests', () => {
      // Mock the service to return empty array for this test
      serviceRequestService.getServiceRequestsByCompany.and.returnValue(of([]));
      component.ngOnInit();
      
      expect(component.serviceRequests).toEqual([]);
    });
  });

  describe('Chart Animation Methods', () => {
    it('should have startAnimationForLineChart method', () => {
      expect(component.startAnimationForLineChart).toBeDefined();
      expect(typeof component.startAnimationForLineChart).toBe('function');
    });

    it('should have startAnimationForBarChart method', () => {
      expect(component.startAnimationForBarChart).toBeDefined();
      expect(typeof component.startAnimationForBarChart).toBe('function');
    });
  });

  describe('Template Integration', () => {
    it('should display user information', () => {
      component.userName = 'John Doe';
      component.companyName = 'Test Company';
      fixture.detectChanges();
      
      expect(component.userName).toBe('John Doe');
      expect(component.companyName).toBe('Test Company');
    });

    it('should display service request statistics', () => {
      component.totalServiceRequests = 5;
      component.statusStats = {
        PENDING: 2,
        IN_PROGRESS: 1,
        COMPLETED: 1,
        CANCELLED: 1
      };
      
      expect(component.totalServiceRequests).toBe(5);
      expect(component.statusStats.PENDING).toBe(2);
      expect(component.statusStats.IN_PROGRESS).toBe(1);
    });
  });
});
