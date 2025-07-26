import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsComponent } from './maps.component';

describe('MapsComponent', () => {
  let component: MapsComponent;
  let fixture: ComponentFixture<MapsComponent>;

  beforeEach(async(() => {
    // Mock Google Maps API
    (window as any).google = {
      maps: {
        LatLng: function(lat: number, lng: number) {
          return { lat, lng };
        },
        Map: function(element: any, options: any) {
          return { element, options };
        },
        Marker: function(options: any) {
          return {
            setMap: function(map: any) {}
          };
        }
      }
    };

    TestBed.configureTestingModule({
      declarations: [ MapsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
