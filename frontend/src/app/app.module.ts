import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { ClientListComponent } from './client/client-list/client-list.component';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    RegisterComponent,
    LoginComponent,
    UnauthorizedComponent,
    AdminUsersComponent,
    ClientListComponent,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
