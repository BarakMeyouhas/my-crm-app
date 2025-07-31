import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) { }

  getCompanies(): Observable<{ id: number; name: string }[]> {
  return this.http.get<{ id: number; name: string }[]>(`${environment.apiUrl}/companies`);
}

}
