import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentsModule } from '../../components/components.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AdminLayoutComponent } from './admin-layout.component';
import { AuthService } from '../../services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

describe('AdminLayoutComponent', () => {
  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;

  beforeEach(async(() => {
    const mockJwtHelper = {
      decodeToken: jasmine.createSpy('decodeToken').and.returnValue({
        userId: 1,
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) + 3600
      }),
      isTokenExpired: jasmine.createSpy('isTokenExpired').and.returnValue(false)
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ComponentsModule, HttpClientTestingModule],
      declarations: [ AdminLayoutComponent ],
      providers: [
        AuthService,
        { provide: JwtHelperService, useValue: mockJwtHelper }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
