// client.service.ts

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class ClientService {
  private baseUrl = `${environment.apiUrl}/clients`;
  private adminUrl = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private get headers() {
    return {
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer ${this.auth.token}`
      ),
    };
  }

  getClients() {
    return this.http.get(this.baseUrl, this.headers);
  }

  createClient(data: any) {
    return this.http.post(this.baseUrl, data, this.headers);
  }

  updateClient(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data, this.headers);
  }

  deleteClient(id: number) {
    return this.http.delete(`${this.adminUrl}/${id}`, this.headers);
  }
}
