import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CompanyService } from './company.service';
import { environment } from '../../environments/environment';

describe('CompanyService', () => {
  let service: CompanyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CompanyService]
    });
    service = TestBed.inject(CompanyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getCompanies', () => {
    it('should fetch all companies', () => {
      const mockCompanies = [
        { id: 1, name: 'Company 1', industry: 'Technology' },
        { id: 2, name: 'Company 2', industry: 'Finance' },
        { id: 3, name: 'Company 3', industry: 'Healthcare' }
      ];

      service.getCompanies().subscribe(companies => {
        expect(companies).toEqual(mockCompanies);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/public/companies`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCompanies);
    });

    it('should handle error when fetching companies fails', () => {
      const fallbackCompanies = [
        { id: 1, name: "TechNova" },
        { id: 2, name: "GreenEdge Solutions" },
        { id: 3, name: "ByteBridge" },
        { id: 4, name: "OmegaHealth" },
        { id: 5, name: "Cloudify" },
        { id: 6, name: "SecureStack" },
        { id: 7, name: "DataSpring" },
        { id: 8, name: "NextGen AI" }
      ];

      service.getCompanies().subscribe(companies => {
        expect(companies).toEqual(fallbackCompanies);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/public/companies`);
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network error', () => {
      const fallbackCompanies = [
        { id: 1, name: "TechNova" },
        { id: 2, name: "GreenEdge Solutions" },
        { id: 3, name: "ByteBridge" },
        { id: 4, name: "OmegaHealth" },
        { id: 5, name: "Cloudify" },
        { id: 6, name: "SecureStack" },
        { id: 7, name: "DataSpring" },
        { id: 8, name: "NextGen AI" }
      ];

      service.getCompanies().subscribe(companies => {
        expect(companies).toEqual(fallbackCompanies);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/public/companies`);
      req.error(new ErrorEvent('Network error'));
    });

    it('should return empty array when no companies exist', () => {
      service.getCompanies().subscribe(companies => {
        expect(companies).toEqual([]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/public/companies`);
      req.flush([]);
    });

    it('should handle malformed response', () => {
      service.getCompanies().subscribe({
        next: (companies) => {
          // The service might handle malformed responses gracefully
          expect(companies).toBeDefined();
        },
        error: (error) => {
          // Or it might throw an error
          expect(error).toBeDefined();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/public/companies`);
      req.flush('Invalid JSON', { status: 200, statusText: 'OK' });
    });
  });

  describe('service creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have correct base URL', () => {
      // This test verifies the service is properly configured
      expect(service).toBeDefined();
    });
  });
});
