import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { AuthService } from "app/services/auth.service";
import { ServiceRequestService } from "../services/service-request.service";
import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('serviceRequestChart', { static: true }) chartCanvas!: ElementRef;
  @ViewChild('trendsChart', { static: true }) trendsChartCanvas!: ElementRef;
  @ViewChild('urgencyChart', { static: true }) urgencyChartCanvas!: ElementRef;
  
  user: any;
  userName: string = '';
  companyName: string = '';
  serviceRequests: any[] = [];
  totalServiceRequests: number = 0;
  latestServiceRequestTitle: string = '';
  serviceRequestChart: Chart | null = null;
  trendsChart: Chart | null = null;
  urgencyChart: Chart | null = null;
  statusStats: { [key: string]: number } = {
    PENDING: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    CANCELLED: 0
  };
  trendsData: { [key: string]: { total: number; completed: number } } = {};
  urgencyStats: { [key: string]: number } = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    CRITICAL: 0
  };

  constructor(private authService: AuthService, private serviceRequestService: ServiceRequestService) {}

  users: any[] = [];



  ngOnInit() {
    // Fetch user profile first to ensure user data is available
    this.authService.fetchUserProfile().subscribe({
      next: () => {
        this.authService.currentUser.subscribe((user) => {
          if (user) {
            this.user = user;
            this.userName = user.firstName ? user.firstName + (user.lastName ? ' ' + user.lastName : '') : (user.name || '');
            this.companyName = user.companyName || '';
            // Fetch service requests for this company only
            this.serviceRequestService.getServiceRequestsByCompany(user.companyId).subscribe({
              next: (requests) => {
                this.serviceRequests = requests;
                this.totalServiceRequests = requests.length;
                this.latestServiceRequestTitle = requests.length > 0 ? requests[0].title : '';
                
                // Debug: Log the first service request to check urgency field
                if (requests.length > 0) {
                  console.log('First service request sample:', requests[0]);
                  console.log('Urgency field present:', 'urgency' in requests[0]);
                  console.log('Urgency value:', requests[0].urgency);
                }
                
                this.calculateStatusStats();
                this.calculateTrendsData(); // Call calculateTrendsData here
                this.calculateUrgencyStats(); // Call calculateUrgencyStats here
                // Create chart after view is initialized
                setTimeout(() => {
                  this.createServiceRequestChart();
                  this.createTrendsChart(); // Call createTrendsChart here
                  this.createUrgencyChart(); // Call createUrgencyChart here
                }, 100);
              },
              error: (err) => {
                console.error('Error fetching service requests:', err);
              }
            });
          }
        });
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
      }
    });
    
    this.authService.getAllUsers().subscribe({
    next: (data) => {
      this.users = data;
      console.log('Users:', this.users); // חשוב לבדוק מה חוזר
    },
    error: (err) => console.error('Failed to load users', err),
  });
  }

  ngAfterViewInit() {
    // Chart will be created after data is loaded
  }

  calculateStatusStats() {
    // Reset stats
    this.statusStats = {
      PENDING: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      CANCELLED: 0
    };

    // Count requests by status
    this.serviceRequests.forEach(request => {
      if (this.statusStats.hasOwnProperty(request.status)) {
        this.statusStats[request.status]++;
      }
    });
    
    console.log('Status Stats:', this.statusStats);
  }

  calculateTrendsData() {
    // Reset trends data
    this.trendsData = {};
    
    // Get the last 6 months
    const months = [];
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      months.push(monthKey);
      this.trendsData[monthKey] = { total: 0, completed: 0 };
    }
    
    // Process service requests
    this.serviceRequests.forEach(request => {
      const requestDate = new Date(request.createdAt);
      const monthKey = requestDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      
      if (this.trendsData[monthKey]) {
        this.trendsData[monthKey].total++;
        if (request.status === 'COMPLETED') {
          this.trendsData[monthKey].completed++;
        }
      }
    });
    
    console.log('Trends Data:', this.trendsData);
  }

  calculateUrgencyStats() {
    // Reset urgency stats
    this.urgencyStats = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0
    };

    console.log('Service Requests for urgency calculation:', this.serviceRequests);

    // Count requests by urgency
    this.serviceRequests.forEach(request => {
      console.log('Processing request:', request.title, 'Urgency:', request.urgency);
      if (this.urgencyStats.hasOwnProperty(request.urgency)) {
        this.urgencyStats[request.urgency]++;
      } else {
        console.warn('Unknown urgency level:', request.urgency, 'for request:', request.title);
      }
    });
    
    console.log('Urgency Stats:', this.urgencyStats);
  }

  createServiceRequestChart() {
    console.log('Creating service request chart...');
    console.log('Chart canvas:', this.chartCanvas);
    console.log('Chart canvas native element:', this.chartCanvas?.nativeElement);
    
    if (this.chartCanvas && this.chartCanvas.nativeElement) {
      // Destroy existing chart if it exists
      if (this.serviceRequestChart) {
        this.serviceRequestChart.destroy();
      }

      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      console.log('Canvas context:', ctx);
      
      // Use actual data or fallback to sample data for testing
      let data = [
        this.statusStats.PENDING || 0,
        this.statusStats.IN_PROGRESS || 0,
        this.statusStats.COMPLETED || 0,
        this.statusStats.CANCELLED || 0
      ];
      
      // If all values are 0, use sample data for testing
      if (data.every(val => val === 0)) {
        console.log('No data available, using sample data for testing');
        data = [5, 3, 8, 1]; // Sample data: Pending, In Progress, Completed, Cancelled
      }
      
      const chartData: ChartData<'bar'> = {
        labels: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
        datasets: [
          {
            label: 'Service Requests by Status',
            data: data,
            backgroundColor: [
              '#ff9800', // Orange for Pending
              '#2196f3', // Blue for In Progress
              '#4caf50', // Green for Completed
              '#f44336'  // Red for Cancelled
            ],
            borderColor: [
              '#e68900',
              '#1976d2',
              '#388e3c',
              '#d32f2f'
            ],
            borderWidth: 1
          }
        ]
      };

      console.log('Chart data:', chartData);

      const config: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.label}: ${context.parsed.y} requests`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      };

      try {
        this.serviceRequestChart = new Chart(ctx, config);
        console.log('Chart created successfully:', this.serviceRequestChart);
      } catch (error) {
        console.error('Error creating chart:', error);
      }
    } else {
      console.error('Chart canvas not found');
    }
  }

  createTrendsChart() {
    console.log('Creating trends chart...');
    console.log('Trends chart canvas:', this.trendsChartCanvas);
    console.log('Trends chart canvas native element:', this.trendsChartCanvas?.nativeElement);

    if (this.trendsChartCanvas && this.trendsChartCanvas.nativeElement) {
      // Destroy existing chart if it exists
      if (this.trendsChart) {
        this.trendsChart.destroy();
      }

      const ctx = this.trendsChartCanvas.nativeElement.getContext('2d');
      console.log('Canvas context:', ctx);

      const labels = Object.keys(this.trendsData);
      const totalSeries = Object.values(this.trendsData).map(item => item.total);
      const completedSeries = Object.values(this.trendsData).map(item => item.completed);

      const chartData: ChartData<'bar'> = {
        labels: labels,
        datasets: [
          {
            label: 'Total Service Requests',
            data: totalSeries,
            backgroundColor: '#2196f3', // Blue
            borderColor: '#1976d2',
            borderWidth: 1
          },
          {
            label: 'Completed Service Requests',
            data: completedSeries,
            backgroundColor: '#4caf50', // Green
            borderColor: '#388e3c',
            borderWidth: 1
          }
        ]
      };

      console.log('Trends chart data:', chartData);

      const config: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 20
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += context.parsed.y;
                  }
                  return label;
                }
              }
            }
          },
          scales: {
            x: {
              stacked: true,
              grid: {
                display: false
              },
              ticks: {
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90
              }
            },
            y: {
              beginAtZero: true,
              stacked: true,
              grid: {
                color: '#eee'
              },
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      };

      try {
        this.trendsChart = new Chart(ctx, config);
        console.log('Trends chart created successfully:', this.trendsChart);
      } catch (error) {
        console.error('Error creating trends chart:', error);
      }
    } else {
      console.error('Trends chart canvas not found');
    }
  }

  createUrgencyChart() {
    console.log('Creating urgency chart...');
    console.log('Urgency chart canvas:', this.urgencyChartCanvas);
    console.log('Urgency chart canvas native element:', this.urgencyChartCanvas?.nativeElement);

    if (this.urgencyChartCanvas && this.urgencyChartCanvas.nativeElement) {
      // Destroy existing chart if it exists
      if (this.urgencyChart) {
        this.urgencyChart.destroy();
      }

      const ctx = this.urgencyChartCanvas.nativeElement.getContext('2d');
      console.log('Canvas context:', ctx);

      const labels = Object.keys(this.urgencyStats);
      const data = Object.values(this.urgencyStats);

      console.log('Urgency chart labels:', labels);
      console.log('Urgency chart data:', data);
      console.log('Urgency stats object:', this.urgencyStats);

      // If all values are 0, use sample data for testing
      if (data.every(val => val === 0)) {
        console.log('No urgency data available, using sample data for testing');
        const sampleData = [3, 5, 2, 1]; // Sample data: LOW, MEDIUM, HIGH, CRITICAL
        const sampleLabels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        
        const chartData: ChartData<'polarArea'> = {
          labels: sampleLabels,
          datasets: [
            {
              label: 'Service Requests by Urgency',
              data: sampleData,
              backgroundColor: [
                '#4caf50', // Green for LOW
                '#ff9800', // Orange for MEDIUM
                '#2196f3', // Blue for HIGH
                '#f44336'  // Red for CRITICAL
              ],
              borderColor: [
                '#388e3c',
                '#e68900',
                '#1976d2',
                '#d32f2f'
              ],
              borderWidth: 1
            }
          ]
        };

        console.log('Using sample urgency chart data:', chartData);

        const config: ChartConfiguration<'polarArea'> = {
          type: 'polarArea',
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  usePointStyle: true,
                  padding: 20
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.r !== null) {
                      label += context.parsed.r;
                    }
                    return label;
                  }
                }
              }
            },
            scales: {
              r: {
                beginAtZero: true,
                grid: {
                  color: '#eee'
                },
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        };

        try {
          this.urgencyChart = new Chart(ctx, config);
          console.log('Urgency chart created successfully with sample data:', this.urgencyChart);
        } catch (error) {
          console.error('Error creating urgency chart:', error);
        }
        return;
      }

      const chartData: ChartData<'polarArea'> = {
        labels: labels,
        datasets: [
          {
            label: 'Service Requests by Urgency',
            data: data,
            backgroundColor: [
              '#4caf50', // Green for LOW
              '#ff9800', // Orange for MEDIUM
              '#2196f3', // Blue for HIGH
              '#f44336'  // Red for CRITICAL
            ],
            borderColor: [
              '#388e3c',
              '#e68900',
              '#1976d2',
              '#d32f2f'
            ],
            borderWidth: 1
          }
        ]
      };

      console.log('Urgency chart data:', chartData);

      const config: ChartConfiguration<'polarArea'> = {
        type: 'polarArea',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 20
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.r !== null) {
                    label += context.parsed.r;
                  }
                  return label;
                }
              }
            }
          },
          scales: {
            r: {
              beginAtZero: true,
              grid: {
                color: '#eee'
              },
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      };

      try {
        this.urgencyChart = new Chart(ctx, config);
        console.log('Urgency chart created successfully:', this.urgencyChart);
      } catch (error) {
        console.error('Error creating urgency chart:', error);
      }
    } else {
      console.error('Urgency chart canvas not found');
    }
  }
}
