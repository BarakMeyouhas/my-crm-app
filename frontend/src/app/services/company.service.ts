import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) { }

  getCompanies(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(`${environment.apiUrl}/api/public/companies`).pipe(
      catchError(error => {
        console.log('Companies endpoint not available yet, using fallback data for registration');
        // Return sample companies for registration - same as seed data
        return of([
          { id: 1, name: "TechNova" },
          { id: 2, name: "GreenEdge Solutions" },
          { id: 3, name: "ByteBridge" },
          { id: 4, name: "OmegaHealth" },
          { id: 5, name: "Cloudify" },
          { id: 6, name: "SecureStack" },
          { id: 7, name: "DataSpring" },
          { id: 8, name: "NextGen AI" }
        ]);
      })
    );
  }
}
