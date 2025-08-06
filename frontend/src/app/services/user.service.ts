import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { environment } from "../../environments/environment";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  company: {
    id: number;
    name: string;
  };
  _count?: {
    createdServiceRequests: number;
  };
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/api/auth`;
  private adminUrl = `${environment.apiUrl}/api/admin`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private get headers() {
    return {
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer ${this.authService.token}`
      ),
    };
  }

  /**
   * Get all users for a specific company
   */
  getCompanyUsers(companyId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users/company/${companyId}`, this.headers);
  }

  /**
   * Get all users (admin only)
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.adminUrl}/users`, this.headers);
  }

  /**
   * Get user by ID
   */
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${userId}`, this.headers);
  }

  /**
   * Create a new user
   */
  createUser(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.adminUrl}/users`, userData, this.headers);
  }

  /**
   * Update user
   */
  updateUser(userId: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.adminUrl}/users/${userId}`, userData, this.headers);
  }

  /**
   * Delete user
   */
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.adminUrl}/users/${userId}`, this.headers);
  }

  /**
   * Get users by role for a specific company
   */
  getCompanyUsersByRole(companyId: number, role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users/company/${companyId}?role=${role}`, this.headers);
  }

  /**
   * Get active users for a company
   */
  getActiveCompanyUsers(companyId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users/company/${companyId}?active=true`, this.headers);
  }
} 