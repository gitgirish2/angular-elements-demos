import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { WeatherDataService } from '../weather-data.service';

@Component({
  selector: 'app-weather-widget',
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherWidgetComponent implements OnInit, OnChanges {

  @Input()
  cityName: string;

  @Output()
  cityNotFound = new EventEmitter<string>();

  weatherData: any;
  isCelsius: boolean;

  constructor(private weatherDataSvc: WeatherDataService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.isCelsius = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.refreshData();
  }

  refreshData() {
    this.weatherDataSvc.getWeather(this.cityName).then(weather => {
      this.weatherData = weather;
      this.cdr.detectChanges();
    },
      error => {
        this.cityNotFound.emit(error);
      });
    
  }

  get temperature() {
    return this.isCelsius ? this.weatherData.main.temp : this.weatherData.main.temp / 5 * 9 + 32;
  }

  changeUnit() {
    this.isCelsius = !this.isCelsius;
    this.cdr.detectChanges();
  }
}
