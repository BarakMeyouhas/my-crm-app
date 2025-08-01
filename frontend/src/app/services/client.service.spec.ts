import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientService } from './client.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientService, AuthService]
    });
    service = TestBed.inject(ClientService);
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

  describe('getClients', () => {
    it('should fetch all clients with auth headers', () => {
      const mockClients = [
        { id: 1, name: 'Client 1', email: 'client1@example.com', phone: '555-111-1111', company: 'Corp 1' },
        { id: 2, name: 'Client 2', email: 'client2@example.com', phone: '555-222-2222', company: 'Corp 2' }
      ];

      service.getClients().subscribe(clients => {
        expect(clients).toEqual(mockClients);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/clients`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush(mockClients);
    });

    it('should handle error when fetching clients fails', () => {
      service.getClients().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/clients`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('createClient', () => {
    it('should create a new client with auth headers', () => {
      const clientData = {
        name: 'New Client',
        email: 'newclient@example.com',
        phone: '555-123-4567',
        company: 'New Corp'
      };

      const mockResponse = {
        id: 3,
        ...clientData,
        createdAt: '2024-01-01T00:00:00.000Z'
      };

      service.createClient(clientData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/clients`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      expect(req.request.body).toEqual(clientData);
      req.flush(mockResponse);
    });

    it('should handle error when creating client fails', () => {
      const clientData = {
        name: 'Invalid Client',
        email: 'invalid@example.com'
      };

      service.createClient(clientData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/clients`);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateClient', () => {
    it('should update an existing client with auth headers', () => {
      const clientId = 1;
      const updateData = {
        name: 'Updated Client',
        email: 'updated@example.com',
        phone: '999-888-7777',
        company: 'Updated Corp'
      };

      const mockResponse = {
        id: clientId,
        ...updateData,
        createdAt: '2024-01-01T00:00:00.000Z'
      };

      service.updateClient(clientId, updateData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/clients/${clientId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockResponse);
    });

    it('should handle error when updating client fails', () => {
      const clientId = 999;
      const updateData = {
        name: 'Non-existent Client'
      };

      service.updateClient(clientId, updateData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/clients/${clientId}`);
      req.flush('Client not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteClient', () => {
    it('should delete a client with auth headers', () => {
      const clientId = 1;
      const mockResponse = { message: 'Client deleted successfully' };

      service.deleteClient(clientId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/admin/users/${clientId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush(mockResponse);
    });

    it('should handle error when deleting client fails', () => {
      const clientId = 999;

      service.deleteClient(clientId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/admin/users/${clientId}`);
      req.flush('Client not found', { status: 404, statusText: 'Not Found' });
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
