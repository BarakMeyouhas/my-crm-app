import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  onSubmit() {
    this.http
      .post<any>("http://localhost:5000/api/auth/login", {
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (res) => {
          localStorage.setItem("token", res.token); // שים לב שהטוקן נשמר ב-localStorage
          const decoded: any = jwtDecode(res.token);
          console.log("Decoded JWT:", decoded);

          const role = decoded.role;

          if (res.role === "admin") {
            this.router.navigate(["/admin-panel"]); // אם המשתמש הוא אדמין, נווט לפאנל הניהול
          } else {
            this.router.navigate(["/dashboard"]);
          }
        },
        error: (err) => {
          this.errorMessage = err.error.message || "Login failed"; // הודעת שגיאה כללית במקרה של כישלון
        },
      });
  }
  email: any;
  password: any;
  errorMessage: any;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {}
}
