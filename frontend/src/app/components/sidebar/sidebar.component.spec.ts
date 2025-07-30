import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService } from '@auth0/angular-jwt';

import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

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
      imports: [RouterTestingModule],
      declarations: [ SidebarComponent ],
      providers: [
        { provide: JwtHelperService, useValue: mockJwtHelper }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
