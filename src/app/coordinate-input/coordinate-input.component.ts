import { Component, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { CoordinatesService } from '../coordinates.service';

@Component({
  selector: 'app-coordinate-input',
  templateUrl: './coordinate-input.component.html',
  styleUrls: ['./coordinate-input.component.css']
})
export class CoordinateInputComponent implements OnInit {
  constructor (
    public coordinatesService: CoordinatesService,
    public dialogRef: MatDialogRef<CoordinateInputComponent>
  ) { }

  ngOnInit () {
  }

  handleSubmit (latitude: string, longitude: string) {
    let confidence,
        zoom;

    // compute confidence
    confidence = this.coordinatesService.computeFromCoordinates(
        latitude, longitude);

    // compute zoom
    zoom = this.coordinatesService.computeZoomFromConfidence(confidence);

    // set location
    this.coordinatesService.setCoordinates({
      confidence: confidence,
      latitude: +latitude,
      longitude: +longitude,
      method: 'coordinate',
      zoom: zoom
    });

    // Use injected reference to close dialog
    this.dialogRef.close();
  }
}
