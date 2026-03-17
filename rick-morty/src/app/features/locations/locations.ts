import {Component, computed, effect, inject, input} from '@angular/core';
import {LocationService} from '../../core/services/location/location-service';
import {APP_ROUTES, FilterResponse, Location, LocationFilterModel} from '../../shared/models';
import {RouterLink} from '@angular/router';
import {LocationCards} from './components/location-cards/location-cards';
import {LocationFilter} from './components/location-filter/location-filter';

@Component({
  selector: 'app-locations',
  imports: [
    RouterLink,
    LocationCards,
    LocationFilter
  ],
  templateUrl: './locations.html',
  styleUrl: './locations.scss',
})
export class Locations {
  readonly lcsService = inject(LocationService)

  page = input.required({
    transform: (value: string | number): number => {
      const parsed = Number(value);
      return isNaN(parsed) || parsed < 1 ? 1 : parsed;
    }
  })
  name = input<string>();
  type = input<string>();
  dimension = input<string>();

  params = computed<Partial<LocationFilterModel>>(() => {
    const query: Partial<LocationFilterModel> = { page: this.page() }

    if (this.name()) query.name = this.name();
    if (this.type()) query.type = this.type();
    if (this.dimension()) query.dimension = this.dimension()

    return query
  })


  nextPageParams = computed<Partial<LocationFilterModel>>(() => ({
    ...this.params(),
    page: this.page() + 1
  }));

  prevPageParams = computed<Partial<LocationFilterModel>>(() => ({
    ...this.params(),
    page: Math.max(1, this.page() - 1) // Protección extra para no bajar de 1
  }));

  constructor() {
    effect(
      () => this.lcsService.setLocation(this.params())
    )
  }

  isList(data: any): data is FilterResponse<Location>{
    return data && 'results' in data
  }

  protected readonly APP_ROUTES = APP_ROUTES;
}
