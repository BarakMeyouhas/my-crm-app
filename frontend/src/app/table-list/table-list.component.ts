import { Component, OnInit } from '@angular/core';
import { ServiceRequestService } from '../services/service-request.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { jwtDecode } from 'jwt-decode';

interface ServiceRequest {
  id: number;
  title: string;
  description: string;
  status: string;
  urgency: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    firstName: string;
    lastName: string;
  };
}

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  serviceRequests: ServiceRequest[] = [];
  filteredRequests: ServiceRequest[] = [];
  loading: boolean = true;
  error: string = '';
  currentUserCompanyId: number | null = null;
  
  // Search and filter properties
  searchTerm: string = '';
  statusFilter: string = '';
  urgencyFilter: string = '';

  constructor(
    private serviceRequestService: ServiceRequestService,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.loadServiceRequests();
  }

  private loadServiceRequests() {
    this.loading = true;
    this.error = '';

    // Get current user's company ID from token
    const token = this.authService.token;
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.currentUserCompanyId = decodedToken.companyId;
        
        if (this.currentUserCompanyId) {
          this.loadServiceRequestsForCompany(this.currentUserCompanyId);
        } else {
          // Fallback: get company ID from profile endpoint
          this.authService.fetchUserProfile().subscribe({
            next: (user) => {
              this.currentUserCompanyId = user.companyId;
              if (this.currentUserCompanyId) {
                this.loadServiceRequestsForCompany(this.currentUserCompanyId);
              } else {
                this.error = 'Unable to determine company. Please log in again.';
                this.loading = false;
              }
            },
            error: (error) => {
              console.error('Error fetching user profile:', error);
              this.error = 'Unable to determine company. Please log in again.';
              this.loading = false;
            }
          });
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        // Fallback: get company ID from profile endpoint
        this.authService.fetchUserProfile().subscribe({
          next: (user) => {
            this.currentUserCompanyId = user.companyId;
            if (this.currentUserCompanyId) {
              this.loadServiceRequestsForCompany(this.currentUserCompanyId);
            } else {
              this.error = 'Unable to determine company. Please log in again.';
              this.loading = false;
            }
          },
          error: (profileError) => {
            console.error('Error fetching user profile:', profileError);
            this.error = 'Authentication error. Please log in again.';
            this.loading = false;
          }
        });
      }
    } else {
      this.error = 'No authentication token found. Please log in.';
      this.loading = false;
    }
  }

  private loadServiceRequestsForCompany(companyId: number) {
    this.serviceRequestService.getServiceRequestsByCompany(companyId)
      .subscribe({
        next: (requests) => {
          this.serviceRequests = requests;
          this.filteredRequests = requests;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading service requests:', error);
          this.error = 'Failed to load service requests. Please try again.';
          this.loading = false;
        }
      });
  }

  // Search and filter methods
  onSearchChange() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.urgencyFilter = '';
    this.filteredRequests = [...this.serviceRequests];
  }

  private applyFilters() {
    this.filteredRequests = this.serviceRequests.filter(request => {
      // Search filter
      const searchMatch = !this.searchTerm || 
        request.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        `${request.createdBy?.firstName} ${request.createdBy?.lastName}`.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Status filter
      const statusMatch = !this.statusFilter || request.status.toLowerCase() === this.statusFilter.toLowerCase();

      // Urgency filter
      const urgencyMatch = !this.urgencyFilter || request.urgency.toLowerCase() === this.urgencyFilter.toLowerCase();

      return searchMatch && statusMatch && urgencyMatch;
    });
  }

  refreshData() {
    this.loadServiceRequests();
  }

  retryLoading() {
    this.error = '';
    this.loadServiceRequests();
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return 'badge badge-warning';
      case 'in_progress':
        return 'badge badge-info';
      case 'completed':
        return 'badge badge-success';
      case 'cancelled':
        return 'badge badge-danger';
      default:
        return 'badge badge-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return 'schedule';
      case 'in_progress':
        return 'play_circle';
      case 'completed':
        return 'check_circle';
      case 'cancelled':
        return 'cancel';
      default:
        return 'help';
    }
  }

  getUrgencyClass(urgency: string): string {
    switch (urgency.toLowerCase()) {
      case 'low':
        return 'badge badge-success';
      case 'medium':
        return 'badge badge-warning';
      case 'high':
        return 'badge badge-danger';
      case 'critical':
        return 'badge badge-danger';
      default:
        return 'badge badge-secondary';
    }
  }

  getUrgencyIcon(urgency: string): string {
    switch (urgency.toLowerCase()) {
      case 'low':
        return 'low_priority';
      case 'medium':
        return 'priority_high';
      case 'high':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'help';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
