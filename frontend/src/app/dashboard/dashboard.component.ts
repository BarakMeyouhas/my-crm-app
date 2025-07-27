import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { AuthService } from "app/services/auth.service";
import * as Chartist from "chartist";
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
  
  user: any;
  userName: string = '';
  companyName: string = '';
  serviceRequests: any[] = [];
  totalServiceRequests: number = 0;
  latestServiceRequestTitle: string = '';
  serviceRequestChart: Chart | null = null;
  statusStats: { [key: string]: number } = {
    PENDING: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    CANCELLED: 0
  };

  constructor(private authService: AuthService, private serviceRequestService: ServiceRequestService) {}

  users: any[] = [];

  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on("draw", function (data) {
      if (data.type === "line" || data.type === "area") {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path
              .clone()
              .scale(1, 0)
              .translate(0, data.chartRect.height())
              .stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint,
          },
        });
      } else if (data.type === "point") {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: "ease",
          },
        });
      }
    });

    seq = 0;
  }

  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on("draw", function (data) {
      if (data.type === "bar") {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: "ease",
          },
        });
      }
    });

    seq2 = 0;
  }

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
                this.calculateStatusStats();
                // Create chart after view is initialized
                setTimeout(() => {
                  this.createServiceRequestChart();
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
    /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

    const dataDailySalesChart: any = {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      series: [[12, 17, 7, 17, 23, 18, 38]],
    };

    const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0,
      }),
      low: 0,
      high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    };

    var dailySalesChart = new Chartist.Line(
      "#dailySalesChart",
      dataDailySalesChart,
      optionsDailySalesChart
    );

    this.startAnimationForLineChart(dailySalesChart);

    /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

    const dataCompletedTasksChart: any = {
      labels: ["12p", "3p", "6p", "9p", "12p", "3a", "6a", "9a"],
      series: [[230, 750, 450, 300, 280, 240, 200, 190]],
    };

    const optionsCompletedTasksChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0,
      }),
      low: 0,
      high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    };

    var completedTasksChart = new Chartist.Line(
      "#completedTasksChart",
      dataCompletedTasksChart,
      optionsCompletedTasksChart
    );

    // start animation for the Completed Tasks Chart - Line Chart
    this.startAnimationForLineChart(completedTasksChart);
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
}
