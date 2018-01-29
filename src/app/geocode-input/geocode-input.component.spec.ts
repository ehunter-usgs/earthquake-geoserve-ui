import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MatFormFieldModule, MatInputModule, MatProgressBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { GeocodeService } from '../geocode.service';
import { CoordinatesService } from '../coordinates.service';

import { GeocodeInputComponent } from './geocode-input.component';


describe('GeocodeInputComponent', () => {
  let component: GeocodeInputComponent;
  let fixture: ComponentFixture<GeocodeInputComponent>;
  let setCoordinatesSpy;
  let computeFromGeocodeSpy;
  let computeZoomFromConfidenceSpy;
  let getLocationSpy;
  let dialog;
  let dialogSpy;
  let coordinatesService;
  let geocodeService;

  const coordinates = {
    confidence: 3,
    latitude: 39.756650000000036,
    longitude: -105.22494999999998,
    method: 'geocode',
    name: 'Golden, Colorado',
    zoom: 9
  };

  beforeEach(async(() => {
    const coordinatesServiceStub = {
      setCoordinates: (location: any) => {
        console.log('stubbified!');
      },
      computeFromGeocode: (geocodeLocation: any) => {
        console.log('stubbified!');
      },
      computeZoomFromConfidence: (confidence: number) => {
        console.log('stubbified!');
      }
    };

    const geocodeServiceStub = {
      getLocation: (address: string) => {
        console.log('stubbified!');
      },
      location: {
        subscribe: () => {
          console.log('stubbified!');
        }
      }
    };

    const dialogStub = {
      close: () => {
        console.log('stubbified!');
      }
    };

    TestBed.configureTestingModule({
      declarations: [
        GeocodeInputComponent
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressBarModule
      ],
      providers: [
        {provide: CoordinatesService, useValue: coordinatesServiceStub},
        {provide: GeocodeService, useValue: geocodeServiceStub},
        {provide: MatDialogRef, useValue: dialogStub}
      ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeocodeInputComponent);
    component = fixture.componentInstance;

    // stub coordinates.service
    coordinatesService = fixture.debugElement.injector.get(CoordinatesService);
    setCoordinatesSpy = spyOn(coordinatesService, 'setCoordinates');
    computeFromGeocodeSpy = spyOn(coordinatesService, 'computeFromGeocode').and.returnValue(coordinates.confidence);
    computeZoomFromConfidenceSpy = spyOn(coordinatesService, 'computeZoomFromConfidence').and.returnValue(coordinates.zoom);

    // stub geocode.service
    geocodeService = fixture.debugElement.injector.get(GeocodeService);
    getLocationSpy = spyOn(geocodeService, 'getLocation');

    // stub dialog
    dialog = fixture.debugElement.injector.get(MatDialogRef);
    dialogSpy = spyOn(dialog, 'close');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('doGeocode', () => {
    it('should call getLocation', () => {
      let address;

      address = 'test';

      // call handleSubmit
      component.doGeocode(address);

      // expects
      expect(geocodeService.getLocation).toHaveBeenCalled();
      expect(geocodeService.getLocation).toHaveBeenCalledWith(address);
      expect(component.showProgressBar).toEqual(true);
    });
  });

  describe('setCoordinates', () => {
    it('should set the correct coordinates', () => {
      let geocodeLocation;

      geocodeLocation = {
        extent: {
          xmax: -105.18494999999997,
          xmin: -105.26494999999998,
          ymax: 39.796650000000035,
          ymin: 39.71665000000004
        },
        feature: {
          geometry: {
            x: -105.22494999999998,
            y: 39.756650000000036
          }
        },
        name: 'Golden, Colorado'
      };

      // call handleSubmit
      component.setCoordinates(geocodeLocation);

      // confidence computed from extents
      expect(coordinatesService.computeFromGeocode).toHaveBeenCalled();
      expect(coordinatesService.computeFromGeocode).toHaveBeenCalledWith(geocodeLocation);

      // zoom calculated from confidence
      expect(coordinatesService.computeZoomFromConfidence).toHaveBeenCalled();
      expect(coordinatesService.computeZoomFromConfidence).toHaveBeenCalledWith(coordinates.confidence);

      // coordinates set
      expect(coordinatesService.setCoordinates).toHaveBeenCalled();
      expect(coordinatesService.setCoordinates).toHaveBeenCalledWith(coordinates);

      // dialog close
      expect(dialog.close).toHaveBeenCalled();

      // progress bar off
      expect(component.showProgressBar).toEqual(false);
    });
  });

});
