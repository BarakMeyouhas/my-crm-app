import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceRequestComponent } from './service-request.component';
import { ServiceRequestService } from '../services/service-request.service';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

describe('ServiceRequestComponent', () => {
  let component: ServiceRequestComponent;
  let fixture: ComponentFixture<ServiceRequestComponent>;
  let mockServiceRequestService: jasmine.SpyObj<ServiceRequestService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const serviceRequestSpy = jasmine.createSpyObj('ServiceRequestService', ['createServiceRequest']);
    const authSpy = jasmine.createSpyObj('AuthService', ['fetchUserProfile']);

    await TestBed.configureTestingModule({
      declarations: [ ServiceRequestComponent ],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ServiceRequestService, useValue: serviceRequestSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    })
    .compileComponents();

    mockServiceRequestService = TestBed.inject(ServiceRequestService) as jasmine.SpyObj<ServiceRequestService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRequestComponent);
    component = fixture.componentInstance;
    
    // Mock the user profile response
    mockAuthService.fetchUserProfile.and.returnValue(of({
      id: 1,
      email: 'test@example.com',
      role: 'Admin',
      firstName: 'John',
      lastName: 'Doe',
      companyId: 1,
      companyName: 'Test Company'
    }));
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.serviceRequestForm).toBeDefined();
    expect(component.serviceRequestForm.get('priority')?.value).toBe('Medium');
  });

  it('should load user company information on init', () => {
    expect(mockAuthService.fetchUserProfile).toHaveBeenCalled();
    expect(component.userCompany).toBeDefined();
  });

  it('should validate required fields', () => {
    const form = component.serviceRequestForm;
    expect(form.valid).toBeFalsy();
    
    form.patchValue({
      title: 'Test Request',
      description: 'This is a test description that is long enough',
      category: 'Technical Support',
      priority: 'High',
      estimatedHours: 10,
      deadline: '2024-12-31'
    });
    
    expect(form.valid).toBeTruthy();
  });
}); 