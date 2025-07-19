import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-admin-users",
  templateUrl: "./admin-users.component.html",
  styleUrls: ["./admin-users.component.css"],
})
export class AdminUsersComponent implements OnInit {
  //
  users: any[] = [];

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    console.log('ngOnInit called in AdminUsersComponent');
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    const headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${token}`
    );

    console.log('Sending GET request to /api/admin/users with headers:', headers);
    this.http
      .get<any[]>("http://localhost:5000/api/admin/users", { headers })
      .subscribe(
        (res) => {
          console.log('Users loaded from API:', res);
          this.users = res;
        },
        (err) => {
          console.error('Error loading users:', err);
        }
      );
  }


}
