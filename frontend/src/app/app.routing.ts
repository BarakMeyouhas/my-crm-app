import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginComponent } from "./auth/login/login.component";
import { RegisterComponent } from "./auth/register/register.component";
import { AuthGuard } from "./guards/auth.guard";
import { UnauthorizedComponent } from "./pages/unauthorized/unauthorized.component";
import { AdminGuard } from "./guards/admin.guard";
import { AdminUsersComponent } from "./admin/admin-users/admin-users.component";
import { LandingComponent } from "./landing/landing.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "unauthorized", component: UnauthorizedComponent },
  { path: "landing", component: LandingComponent },
  {
    path: "",
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./layouts/admin-layout/admin-layout.module").then(
            (m) => m.AdminLayoutModule
          ),
        data: { roles: ["admin", "client"] },
      },
      {
        path: "admin-panel",
        component: AdminUsersComponent,
        canActivate: [AdminGuard],
        data: { roles: ["admin"] }, // רק אדמין
      },
    ],
  },
  { path: "**", redirectTo: "login" },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [],
})
export class AppRoutingModule {}
