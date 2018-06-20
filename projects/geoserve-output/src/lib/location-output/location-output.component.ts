import { Component, Input, OnInit } from '@angular/core';

import { CoordinatesService } from 'location-input';

@Component({
  selector: 'app-location-output',
  templateUrl: './location-output.component.html',
  styleUrls: ['./location-output.component.css']
})
export class LocationOutputComponent implements OnInit {

  constructor (public coordinatesService: CoordinatesService) {}

  ngOnInit() {
  }

}