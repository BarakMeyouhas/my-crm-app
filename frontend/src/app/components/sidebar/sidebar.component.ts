import { Component, OnInit } from "@angular/core";
import { jwtDecode } from "jwt-decode";

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  onlyAdmin?: boolean; // שדה אופציונלי
}
export const ROUTES: RouteInfo[] = [
  { path: "/dashboard", title: "Dashboard", icon: "dashboard", class: "" },
      { path: "/service-request", title: "Service Request", icon: "assignment", class: "" },
  {
    path: "/table-list",
    title: "Table List",
    icon: "content_paste",
    class: "",
  },
  {
    path: "/typography",
    title: "Typography",
    icon: "library_books",
    class: "",
  },
  { path: "/icons", title: "Icons", icon: "bubble_chart", class: "" },
  { path: "/maps", title: "Maps", icon: "location_on", class: "" },
  {
    path: "/notifications",
    title: "Notifications",
    icon: "notifications",
    class: "",
  },
  {
    path: "/admin-panel",
    title: "Admin Panel",
    icon: "admin",
    class: "",
    onlyAdmin: true,
  },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  isAdmin: boolean = false;

  menuItems: any[];

  constructor() {}

  ngOnInit() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.isAdmin = decodedToken?.role === "Admin";
      } catch (error) {
        console.warn('Invalid token in localStorage:', error);
        this.isAdmin = false;
      }
    }
    this.menuItems = ROUTES.filter((menuItem) => {
      if (menuItem.onlyAdmin) {
        return this.isAdmin;
      }
      return true;
    });
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
}
