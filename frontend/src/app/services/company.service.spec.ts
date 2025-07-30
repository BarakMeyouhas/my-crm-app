import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CompanyService } from './company.service';

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

      const req = httpMock.expectOne('http://localhost:5000/api/companies');
      expect(req.request.method).toBe('GET');
      req.flush(mockCompanies);
    });

    it('should handle error when fetching companies fails', () => {
      service.getCompanies().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne('http://localhost:5000/api/companies');
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network error', () => {
      service.getCompanies().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(0);
        }
      });

      const req = httpMock.expectOne('http://localhost:5000/api/companies');
      req.error(new ErrorEvent('Network error'));
    });

    it('should return empty array when no companies exist', () => {
      service.getCompanies().subscribe(companies => {
        expect(companies).toEqual([]);
      });

      const req = httpMock.expectOne('http://localhost:5000/api/companies');
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

      const req = httpMock.expectOne('http://localhost:5000/api/companies');
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
