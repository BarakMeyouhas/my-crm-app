import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  features = [
    {
      icon: 'fas fa-users',
      title: 'Customer Management',
      description: 'Keep all your customer information in one centralized location with detailed profiles and interaction history.'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Sales Analytics',
      description: 'Track your sales performance with real-time dashboards and detailed reports to make data-driven decisions.'
    },
    {
      icon: 'fas fa-tasks',
      title: 'Task Automation',
      description: 'Automate repetitive tasks and workflows to save time and reduce errors in your daily operations.'
    },
    {
      icon: 'fas fa-bell',
      title: 'Smart Notifications',
      description: 'Never miss an important update with customizable alerts and notifications tailored to your needs.'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile Access',
      description: 'Access your CRM on the go with our fully responsive mobile application for iOS and Android.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with regular backups and compliance with industry data protection standards.'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}