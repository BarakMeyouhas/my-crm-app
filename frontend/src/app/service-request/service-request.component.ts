import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceRequestService } from '../services/service-request.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.css']
})
export class ServiceRequestComponent implements OnInit {
  serviceRequestForm!: FormGroup;
  companies: any[] = [];
  userCompany: any = null;
  message: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private serviceRequestService: ServiceRequestService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    console.log('🔄 ServiceRequestComponent initialized');
    this.initializeForm();
    this.loadUserCompany();
  }

  initializeForm() {
    console.log('📝 Initializing service request form');
    this.serviceRequestForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      priority: ['Medium', Validators.required],
      category: ['', Validators.required],
      estimatedHours: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
      deadline: ['', Validators.required],
      attachments: ['']
    });
    
    console.log('✅ Form initialized with controls:', Object.keys(this.serviceRequestForm.controls));
    
    // Log form value changes
    this.serviceRequestForm.valueChanges.subscribe(value => {
      console.log('📊 Form value changed:', value);
    });
    
    // Log form status changes
    this.serviceRequestForm.statusChanges.subscribe(status => {
      console.log('🔍 Form status:', status);
      if (status === 'INVALID') {
        console.log('❌ Form validation errors:', this.getFormErrors());
      }
    });
  }

  getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.serviceRequestForm.controls).forEach(key => {
      const control = this.serviceRequestForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  loadUserCompany() {
    console.log('🏢 Loading user company information...');
    this.authService.fetchUserProfile().subscribe({
      next: (user) => {
        console.log('✅ User profile loaded:', user);
        this.userCompany = user;
        console.log('🏢 User company:', this.userCompany);
      },
      error: (err) => {
        console.error('❌ Error loading user company:', err);
        this.message = 'Error loading user information';
      }
    });
  }

  onSubmit() {
    console.log('🚀 Form submission started');
    console.log('📋 Current form value:', this.serviceRequestForm.value);
    console.log('🔍 Form valid:', this.serviceRequestForm.valid);
    console.log('🏢 User company:', this.userCompany);
    
    if (!this.serviceRequestForm.valid) {
      console.log('❌ Form is invalid. Validation errors:', this.getFormErrors());
      this.message = 'Please fill in all required fields correctly.';
      return;
    }
    
    if (!this.userCompany) {
      console.log('❌ No user company found');
      this.message = 'Error: User company information not available.';
      return;
    }

    this.isLoading = true;
    this.message = '';

    const formData = this.serviceRequestForm.value;
    console.log('📦 Form data to submit:', formData);
    
    const serviceRequest = {
      title: formData.title,
      description: formData.description,
      status: 'PENDING',
      dueDate: formData.deadline,
      companyId: this.userCompany.companyId,
      createdById: this.userCompany.id
    };
    
    console.log('📤 Service request payload:', serviceRequest);

    this.serviceRequestService.createServiceRequest(serviceRequest).subscribe({
      next: (response) => {
        console.log('✅ Service request created successfully:', response);
        this.message = 'Service request created successfully!';
        this.serviceRequestForm.reset();
        this.initializeForm();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error creating service request:', err);
        this.message = 'Error creating service request. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onFileChange(event: any) {
    console.log('📎 File change event:', event);
    const files = event.target.files;
    if (files.length > 0) {
      console.log('📁 Files selected:', files);
      this.serviceRequestForm.patchValue({
        attachments: files
      });
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'High': return '#dc2626';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  }

  // Debug method to log current form state
  debugFormState() {
    console.log('🔍 Current form state:');
    console.log('Form valid:', this.serviceRequestForm.valid);
    console.log('Form value:', this.serviceRequestForm.value);
    console.log('Form errors:', this.getFormErrors());
    console.log('User company:', this.userCompany);
  }
} 