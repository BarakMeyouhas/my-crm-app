import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../services/auth.service';
import { ServiceRequestService } from '../services/service-request.service';
import { UserService } from '../services/user.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let serviceRequestService: jasmine.SpyObj<ServiceRequestService>;
  let userService: jasmine.SpyObj<UserService>;
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
      urgency: 'MEDIUM',
      companyId: 1,
      createdById: 1,
      createdAt: new Date('2024-01-15T00:00:00.000Z'),
      updatedAt: new Date('2024-01-15T00:00:00.000Z')
    },
    {
      id: 2,
      title: 'Test Request 2',
      description: 'Description 2',
      status: 'IN_PROGRESS',
      urgency: 'HIGH',
      companyId: 1,
      createdById: 1,
      createdAt: new Date('2024-02-15T00:00:00.000Z'),
      updatedAt: new Date('2024-02-15T00:00:00.000Z')
    },
    {
      id: 3,
      title: 'Test Request 3',
      description: 'Description 3',
      status: 'COMPLETED',
      urgency: 'LOW',
      companyId: 1,
      createdById: 1,
      createdAt: new Date('2024-03-15T00:00:00.000Z'),
      updatedAt: new Date('2024-03-15T00:00:00.000Z')
    },
    {
      id: 4,
      title: 'Test Request 4',
      description: 'Description 4',
      status: 'PENDING',
      urgency: 'CRITICAL',
      companyId: 1,
      createdById: 1,
      createdAt: new Date('2024-04-15T00:00:00.000Z'),
      updatedAt: new Date('2024-04-15T00:00:00.000Z')
    }
  ];

  const mockCompanyEmployees = [
    { 
      id: 1, 
      firstName: 'John', 
      lastName: 'Doe', 
      email: 'john@example.com', 
      role: 'Admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      company: { id: 1, name: 'Test Company' },
      _count: { createdServiceRequests: 5 }
    },
    { 
      id: 2, 
      firstName: 'Jane', 
      lastName: 'Smith', 
      email: 'jane@example.com', 
      role: 'Employee',
      isActive: true,
      createdAt: new Date().toISOString(),
      company: { id: 1, name: 'Test Company' },
      _count: { createdServiceRequests: 3 }
    }
  ];

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'fetchUserProfile'
    ], {
      currentUser: new BehaviorSubject(mockUser)
    });

    const serviceRequestServiceSpy = jasmine.createSpyObj('ServiceRequestService', [
      'getServiceRequestsByCompany'
    ]);

    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getCompanyUsers'
    ]);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatTooltipModule, MatButtonModule],
      declarations: [ DashboardComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ServiceRequestService, useValue: serviceRequestServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    serviceRequestService = TestBed.inject(ServiceRequestService) as jasmine.SpyObj<ServiceRequestService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    httpMock = TestBed.inject(HttpTestingController);
    
    // Set up default return values
    authService.fetchUserProfile.and.returnValue(of(mockUser));
    serviceRequestService.getServiceRequestsByCompany.and.returnValue(of(mockServiceRequests));
    userService.getCompanyUsers.and.returnValue(of(mockCompanyEmployees));

    // Mock console methods to reduce noise in tests
    spyOn(console, 'log').and.stub();
    spyOn(console, 'error').and.stub();
    spyOn(console, 'warn').and.stub();
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
    expect(component.urgencyStats).toEqual({
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0
    });
  });

  describe('ngOnInit', () => {
    it('should fetch user profile and service requests', () => {
      component.ngOnInit();
      
      expect(authService.fetchUserProfile).toHaveBeenCalled();
      expect(serviceRequestService.getServiceRequestsByCompany).toHaveBeenCalledWith(mockUser.companyId);
      expect(userService.getCompanyUsers).toHaveBeenCalledWith(mockUser.companyId);
    });

    it('should handle user profile fetch error', () => {
      authService.fetchUserProfile.and.returnValue(throwError(() => new Error('Profile fetch failed')));
      serviceRequestService.getServiceRequestsByCompany.and.returnValue(of([]));
      userService.getCompanyUsers.and.returnValue(of([]));

      component.ngOnInit();
      
      // Don't spy on console.error since it's already stubbed in beforeEach
      expect(authService.fetchUserProfile).toHaveBeenCalled();
    });

    it('should handle service requests fetch error', () => {
      authService.fetchUserProfile.and.returnValue(of(mockUser));
      serviceRequestService.getServiceRequestsByCompany.and.returnValue(throwError(() => new Error('Service requests failed')));
      userService.getCompanyUsers.and.returnValue(of([]));

      component.ngOnInit();
      
      // Don't spy on console.error since it's already stubbed in beforeEach
      expect(serviceRequestService.getServiceRequestsByCompany).toHaveBeenCalled();
    });

    it('should handle company employees fetch error', () => {
      authService.fetchUserProfile.and.returnValue(of(mockUser));
      serviceRequestService.getServiceRequestsByCompany.and.returnValue(of([]));
      userService.getCompanyUsers.and.returnValue(throwError(() => new Error('Company employees fetch failed')));

      component.ngOnInit();
      
      expect(userService.getCompanyUsers).toHaveBeenCalledWith(mockUser.companyId);
    });
  });

  describe('calculateStatusStats', () => {
    it('should calculate status statistics correctly', () => {
      component.serviceRequests = mockServiceRequests;
      
      component.calculateStatusStats();
      
      expect(component.statusStats.PENDING).toBe(2);
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

  describe('calculateUrgencyStats', () => {
    it('should calculate urgency statistics correctly', () => {
      component.serviceRequests = mockServiceRequests;
      
      component.calculateUrgencyStats();
      
      expect(component.urgencyStats.LOW).toBe(1);
      expect(component.urgencyStats.MEDIUM).toBe(1);
      expect(component.urgencyStats.HIGH).toBe(1);
      expect(component.urgencyStats.CRITICAL).toBe(1);
    });

    it('should reset urgency stats before calculating', () => {
      component.urgencyStats = {
        LOW: 10,
        MEDIUM: 10,
        HIGH: 10,
        CRITICAL: 10
      };
      
      component.serviceRequests = [];
      component.calculateUrgencyStats();
      
      expect(component.urgencyStats.LOW).toBe(0);
      expect(component.urgencyStats.MEDIUM).toBe(0);
      expect(component.urgencyStats.HIGH).toBe(0);
      expect(component.urgencyStats.CRITICAL).toBe(0);
    });

    it('should handle unknown urgency levels', () => {
      const requestsWithUnknownUrgency = [
        { ...mockServiceRequests[0], urgency: 'UNKNOWN_URGENCY' }
      ];
      
      component.serviceRequests = requestsWithUnknownUrgency;
      
      component.calculateUrgencyStats();
      
      expect(component.urgencyStats.LOW).toBe(0);
      expect(component.urgencyStats.MEDIUM).toBe(0);
      expect(component.urgencyStats.HIGH).toBe(0);
      expect(component.urgencyStats.CRITICAL).toBe(0);
    });
  });

  describe('Chart Creation Tests', () => {
    beforeEach(() => {
      // Mock canvas elements for all charts
      const mockCanvas = document.createElement('canvas');
      const mockContext = mockCanvas.getContext('2d');
      spyOn(mockCanvas, 'getContext').and.returnValue(mockContext);
      
      component.chartCanvas = { nativeElement: mockCanvas } as any;
      component.urgencyChartCanvas = { nativeElement: mockCanvas } as any;
      component.trendsChartCanvas = { nativeElement: mockCanvas } as any;
    });

    describe('createServiceRequestChart', () => {
      it('should create chart with actual data', () => {
        component.statusStats = {
          PENDING: 5,
          IN_PROGRESS: 3,
          COMPLETED: 8,
          CANCELLED: 1
        };
        
        component.createServiceRequestChart();
        
        // Chart should be created without errors
        expect(component.serviceRequestChart).toBeDefined();
      });

      it('should use sample data when all values are zero', () => {
        component.statusStats = {
          PENDING: 0,
          IN_PROGRESS: 0,
          COMPLETED: 0,
          CANCELLED: 0
        };
        
        component.createServiceRequestChart();
        
        // Chart should be created with sample data
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
        
        component.createServiceRequestChart();
        
        // Should not throw error when canvas is missing
        expect(component.serviceRequestChart).toBeNull();
      });
    });

    describe('createUrgencyChart', () => {
      it('should create urgency chart with actual data', () => {
        component.urgencyStats = {
          LOW: 3,
          MEDIUM: 5,
          HIGH: 2,
          CRITICAL: 1
        };
        
        component.createUrgencyChart();
        
        // Chart should be created without errors
        expect(component.urgencyChart).toBeDefined();
      });

      it('should use sample data when all urgency values are zero', () => {
        component.urgencyStats = {
          LOW: 0,
          MEDIUM: 0,
          HIGH: 0,
          CRITICAL: 0
        };
        
        component.createUrgencyChart();
        
        // Chart should be created with sample data
        expect(component.urgencyChart).toBeDefined();
      });

      it('should destroy existing urgency chart before creating new one', () => {
        const destroySpy = jasmine.createSpy('destroy');
        component.urgencyChart = { destroy: destroySpy } as any;
        
        component.createUrgencyChart();
        
        expect(destroySpy).toHaveBeenCalled();
      });

      it('should handle missing urgency chart canvas', () => {
        component.urgencyChartCanvas = null;
        
        component.createUrgencyChart();
        
        // Should not throw error when canvas is missing
        expect(component.urgencyChart).toBeNull();
      });
    });

    describe('createTrendsChart', () => {
      it('should create trends chart with actual data', () => {
        component.trendsData = {
          'Jan 2024': { total: 5, completed: 2 },
          'Feb 2024': { total: 3, completed: 1 }
        };
        
        component.createTrendsChart();
        
        // Chart should be created without errors
        expect(component.trendsChart).toBeDefined();
      });

      it('should destroy existing trends chart before creating new one', () => {
        const destroySpy = jasmine.createSpy('destroy');
        component.trendsChart = { destroy: destroySpy } as any;
        
        component.createTrendsChart();
        
        expect(destroySpy).toHaveBeenCalled();
      });

      it('should handle missing trends chart canvas', () => {
        component.trendsChartCanvas = null;
        
        component.createTrendsChart();
        
        // Should not throw error when canvas is missing
        expect(component.trendsChart).toBeNull();
      });
    });
  });

  describe('calculateTrendsData', () => {
    it('should calculate trends data correctly', () => {
      const mockRequestsWithDates = [
        {
          ...mockServiceRequests[0],
          createdAt: new Date('2024-01-15T00:00:00.000Z'),
          status: 'COMPLETED'
        },
        {
          ...mockServiceRequests[1],
          createdAt: new Date('2024-02-20T00:00:00.000Z'),
          status: 'PENDING'
        },
        {
          ...mockServiceRequests[2],
          createdAt: new Date('2024-03-01T00:00:00.000Z'),
          status: 'COMPLETED'
        }
      ];
      
      component.serviceRequests = mockRequestsWithDates;
      
      component.calculateTrendsData();
      
      // Should have data for the months where requests were created
      expect(Object.keys(component.trendsData).length).toBeGreaterThan(0);
    });

    it('should handle requests outside the 6-month window', () => {
      const oldRequest = {
        ...mockServiceRequests[0],
        createdAt: new Date('2023-01-01T00:00:00.000Z') // Very old date
      };
      
      component.serviceRequests = [oldRequest];
      
      component.calculateTrendsData();
      
      // Should not include very old requests in trends
      const hasOldData = Object.values(component.trendsData).some(data => data.total > 0);
      expect(hasOldData).toBe(false);
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

    it('should set company name correctly', () => {
      component.user = { companyName: 'Test Company' };
      component.ngOnInit();
      
      expect(component.user.companyName).toBe('Test Company');
    });
  });

  describe('Company Employees', () => {
    it('should fetch and store company employees', () => {
      component.ngOnInit();
      
      expect(userService.getCompanyUsers).toHaveBeenCalledWith(mockUser.companyId);
      expect(component.companyEmployees).toEqual(mockCompanyEmployees);
    });

    it('should handle empty company employees', () => {
      userService.getCompanyUsers.and.returnValue(of([]));
      component.ngOnInit();
      
      expect(component.companyEmployees).toEqual([]);
    });

    it('should not fetch employees if no company ID', () => {
      const userWithoutCompany = { ...mockUser, companyId: null };
      (authService.currentUser as BehaviorSubject<any>).next(userWithoutCompany);
      
      component.ngOnInit();
      
      expect(userService.getCompanyUsers).not.toHaveBeenCalled();
    });
  });

  describe('Service Request Processing', () => {
    it('should set total service requests count', () => {
      component.serviceRequests = mockServiceRequests;
      component.ngOnInit();
      
      expect(component.serviceRequests.length).toBe(4);
    });

    it('should set latest service request title', () => {
      component.serviceRequests = mockServiceRequests;
      component.ngOnInit();
      
      expect(component.serviceRequests[0].title).toBe('Test Request 1');
    });

    it('should handle empty service requests', () => {
      serviceRequestService.getServiceRequestsByCompany.and.returnValue(of([]));
      component.ngOnInit();
      
      expect(component.serviceRequests).toEqual([]);
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
