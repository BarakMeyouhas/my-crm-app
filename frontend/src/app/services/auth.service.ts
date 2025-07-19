import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";

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
  private apiUrl = 'http://localhost:5000/api'; // Add your API base URL here

  constructor(private http: HttpClient) {}

  get token(): string | null {
    return localStorage.getItem("token");
  }

  get currentUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  getAllUsers(): Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any[]>('http://localhost:5000/api/admin/users', { headers });
}


  fetchUserProfile(): Observable<any> {
    const headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.token}`
    );
    return this.http
      .get("http://localhost:5000/api/profile", { headers })
      .pipe(tap((user) => this.userSubject.next(user)));
  }

  logout() {
    localStorage.removeItem("token");
    this.userSubject.next(null);
  }
}
