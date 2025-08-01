import { HttpClient } from "@angular/common/http";
import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
// Make sure the following file exists: src/app/auth/auth.service.ts
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit, OnDestroy {
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  password: string = "";
  companyId: number | null = null;
  message: string = "";
  role: string = "";
  companies: { id: number; name: string }[] = [];
  selectedCompanyId!: number;
  registerForm!: FormGroup;

  // Testimonials functionality
  testimonials = [
    {
      text: "Servix transformed our service management completely. We've seen a 40% improvement in response times.",
      author: "Sarah Johnson",
      position: "Operations Manager",
      company: "TechCorp"
    },
    {
      text: "The best CRM solution we've ever used. Intuitive, powerful, and customer support is outstanding.",
      author: "Michael Chen",
      position: "CEO",
      company: "InnovateLab"
    },
    {
      text: "Finally, a service management platform that actually understands our business needs.",
      author: "Emily Rodriguez",
      position: "Service Director",
      company: "Global Solutions"
    }
  ];
  currentTestimonial = 0;
  private testimonialInterval: any;
  animationDirection: 'left' | 'right' | 'auto' = 'right';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

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

  // תוודא שאתה טוען companies לפני הטופס, למשל ב-ngOnInit:
  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      companyId: [null, Validators.required],
      role: [""],
      subscriptionPlan: ["Basic", Validators.required],
    });
    this.loadCompanies();
    
    // Start testimonial rotation
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

  loadCompanies() {
    // כאן תקרא ל-API שמחזיר את רשימת החברות
    this.http
      .get<{ id: number; name: string }[]>(
        `${environment.apiUrl}/api/companies`
      )
      .subscribe({
        next: (data) => {
          this.companies = data;
        },
        error: (err) => {
          console.error("Failed to load companies", err);
        },
      });
  }
  onSubmit() {
    console.log('onSubmit called');
    console.log('Form valid:', this.registerForm.valid);
    console.log('Form errors:', this.registerForm.errors);
    // Log each control's status and errors
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      console.log(`Control: ${key}, Value:`, control?.value, ', Valid:', control?.valid, ', Errors:', control?.errors);
    });
    if (this.registerForm.invalid) {
      console.log('Form is invalid, not submitting.');
      return;
    }
    console.log("onSubmit triggered");

    const formData = this.registerForm.value;

    // Prepare request body as expected by backend
    const requestBody = {
      company: {
        companyId: formData.companyId
      },
      user: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      }
    };

    console.log('RequestBody:', requestBody);

    this.authService.register(requestBody).subscribe(
      (res) => {
        this.message = "Registration successful!";
      },
      (err) => {
        this.message = "Registration failed.";
      }
    );
  }

  goToLogin() {
    this.router.navigate(["/login"]);
  }
}
