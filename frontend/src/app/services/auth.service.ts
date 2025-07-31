import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";

// Define or import the User interface
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  private apiUrl = environment.apiUrl;
  private adminUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  get token(): string | null {
    return localStorage.getItem("token");
  }

  get currentUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  getAllUsers(): Observable<any[]> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http.get<any[]>(`${this.adminUrl}/users`, {
      headers,
    });
  }

  fetchUserProfile(): Observable<any> {
    const headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.token}`
    );
    return this.http
      .get(`${this.apiUrl}/profile`, { headers })
      .pipe(tap((user) => this.userSubject.next(user)));
  }

  deleteUser(userId: number): Observable<any> {
    const token = this.token;
    if (!token) {
      throw new Error("No auth token found");
    }
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http.delete(`${this.adminUrl}/users/${userId}`, { headers });
  }

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  logout() {
    localStorage.removeItem("token");
    this.userSubject.next(null);
  }
}
