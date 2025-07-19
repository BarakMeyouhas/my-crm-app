import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email: string = '';
  password: string = '';
  message: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }
  onSubmit() {
    this.http.post<any>('http://localhost:5000/api/auth/register', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.message = 'Registration successful!';
        this.email = '';
        this.password = '';
      },
      error: (err) => {
        this.message = err.error.message || 'Registration failed.';
      }
    });
  }

}
