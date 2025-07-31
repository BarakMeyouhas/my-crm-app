import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ServiceRequestService {
  private baseUrl = `${environment.apiUrl}/service-requests`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private get headers() {
    return {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.auth.token}`
      ),
    };
  }

  getServiceRequests(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, this.headers);
  }

  getServiceRequestsByCompany(companyId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?companyId=${companyId}`, this.headers);
  }

  createServiceRequest(serviceRequest: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, serviceRequest, this.headers);
  }
} 