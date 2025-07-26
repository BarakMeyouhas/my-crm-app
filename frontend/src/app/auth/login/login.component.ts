import { Component, OnInit, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {
  testimonials = [
    {
      text: 'Impressed with the immediate results; I got clients and projects in the first week.',
      name: 'Jonas Kim',
      title: 'Product Designer',
      avatar: '👤',
    },
    {
      text: 'The onboarding was seamless and the support team is fantastic. My freelance business has grown so much!',
      name: 'Maria Lopez',
      title: 'Freelance Developer',
      avatar: '👩‍💻',
    },
    {
      text: 'A must-have tool for anyone looking to manage clients efficiently. Highly recommended!',
      name: 'David Smith',
      title: 'Consultant',
      avatar: '🧑‍💼',
    },
  ];
  currentTestimonial = 0;
  private testimonialInterval: any;
  animationDirection: 'left' | 'right' | 'auto' = 'right';

  setTestimonial(index: number) {
    this.animationDirection = index > this.currentTestimonial ? 'right' : 'left';
    this.currentTestimonial = index;
    
    // Reset the interval
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
    this.testimonialInterval = setInterval(() => {
      this.animationDirection = 'right';
      this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
    }, 4000);
  }

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

  goToRegister() {
    this.router.navigate(["/register"]);
  }

  ngOnInit(): void {
    this.testimonialInterval = setInterval(() => {
      this.animationDirection = 'auto';
      this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
    }, 4000);
  }

  ngOnDestroy(): void {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
  }
}
