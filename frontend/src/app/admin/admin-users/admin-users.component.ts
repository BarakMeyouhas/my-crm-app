import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "../../services/auth.service";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-admin-users",
  templateUrl: "./admin-users.component.html",
  styleUrls: ["./admin-users.component.css"],
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    console.log("ngOnInit called in AdminUsersComponent!");
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);

    console.log(
      "Sending GET request to /api/admin/users with headers:",
      headers
    );
    this.http
      .get<any[]>(`${environment.apiUrl}/api/admin/users`, { headers })
      .subscribe(
        (res) => {
          console.log("Users loaded from API:", res);
          this.users = res;
        },
        (err) => {
          console.error("Error loading users:", err);
        }
      );
  }

  deleteUser(userId: number): void {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);

    this.http
      .delete(`${environment.apiUrl}/api/admin/users/${userId}`, { headers })
      .subscribe(
        () => {
          console.log("User deleted:", userId);
          this.users = this.users.filter((u) => u.id !== userId);
        },
        (err) => {
          console.error("Error deleting user:", err);
        }
      );
  }
}
