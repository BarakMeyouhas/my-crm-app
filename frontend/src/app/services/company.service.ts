import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) { }

  getCompanies(): Observable<{ id: number; name: string }[]> {
  return this.http.get<{ id: number; name: string }[]>("http://localhost:5000/api/companies");
}

}
