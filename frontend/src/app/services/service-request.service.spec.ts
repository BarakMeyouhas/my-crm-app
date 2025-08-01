import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServiceRequestService } from './service-request.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('ServiceRequestService', () => {
  let service: ServiceRequestService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServiceRequestService, AuthService]
    });
    service = TestBed.inject(ServiceRequestService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
  });

  describe('getServiceRequests', () => {
    it('should fetch all service requests with auth headers', () => {
      const mockServiceRequests = [
        {
          id: 1,
          title: 'Service Request 1',
          description: 'Description for request 1',
          status: 'PENDING',
          companyId: 1,
          createdById: 1,
          company: { id: 1, name: 'Company 1' },
          createdBy: { id: 1, firstName: 'John', lastName: 'Doe' },
          createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
          id: 2,
          title: 'Service Request 2',
          description: 'Description for request 2',
          status: 'IN_PROGRESS',
          companyId: 1,
          createdById: 1,
          company: { id: 1, name: 'Company 1' },
          createdBy: { id: 1, firstName: 'John', lastName: 'Doe' },
          createdAt: '2024-01-02T00:00:00.000Z'
        }
      ];

      service.getServiceRequests().subscribe(requests => {
        expect(requests).toEqual(mockServiceRequests);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/service-requests`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush(mockServiceRequests);
    });

    it('should fetch service requests filtered by companyId', () => {
      const companyId = 1;
      const mockServiceRequests = [
        {
          id: 1,
          title: 'Company 1 Request',
          description: 'Description',
          status: 'PENDING',
          companyId: 1,
          createdById: 1,
          company: { id: 1, name: 'Company 1' },
          createdBy: { id: 1, firstName: 'John', lastName: 'Doe' },
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      ];

      service.getServiceRequestsByCompany(companyId).subscribe(requests => {
        expect(requests).toEqual(mockServiceRequests);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/service-requests?companyId=${companyId}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush(mockServiceRequests);
    });

    it('should handle error when fetching service requests fails', () => {
      service.getServiceRequests().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/service-requests`);
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should return empty array when no service requests exist', () => {
      service.getServiceRequests().subscribe(requests => {
        expect(requests).toEqual([]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/service-requests`);
      req.flush([]);
    });
  });

  describe('createServiceRequest', () => {
    it('should create a new service request', () => {
      const serviceRequestData = {
        title: 'New Service Request',
        description: 'This is a new service request',
        status: 'PENDING',
        dueDate: '2024-12-31T23:59:59.000Z',
        companyId: 1,
        createdById: 1
      };

      const mockResponse = {
        id: 3,
        ...serviceRequestData,
        company: { id: 1, name: 'Company 1' },
        createdBy: { id: 1, firstName: 'John', lastName: 'Doe' },
        createdAt: '2024-01-01T00:00:00.000Z'
      };

      service.createServiceRequest(serviceRequestData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/service-requests`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      expect(req.request.body).toEqual(serviceRequestData);
      req.flush(mockResponse);
    });

    it('should create a service request with default status', () => {
      const serviceRequestData = {
        title: 'Service Request with Default Status',
        description: 'This request should have PENDING status by default',
        companyId: 1,
        createdById: 1
      };

      const mockResponse = {
        id: 4,
        ...serviceRequestData,
        status: 'PENDING',
        company: { id: 1, name: 'Company 1' },
        createdBy: { id: 1, firstName: 'John', lastName: 'Doe' },
        createdAt: '2024-01-01T00:00:00.000Z'
      };

      service.createServiceRequest(serviceRequestData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/service-requests`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      expect(req.request.body).toEqual(serviceRequestData);
      req.flush(mockResponse);
    });

    it('should handle error when creating service request fails', () => {
      const serviceRequestData = {
        title: 'Invalid Service Request',
        description: 'This request is missing required fields'
      };

      service.createServiceRequest(serviceRequestData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/service-requests`);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle server error when creating service request', () => {
      const serviceRequestData = {
        title: 'Service Request',
        description: 'Description',
        companyId: 1,
        createdById: 1
      };

      service.createServiceRequest(serviceRequestData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/service-requests`);
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('service creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have AuthService injected', () => {
      expect(authService).toBeTruthy();
    });
  });
}); 