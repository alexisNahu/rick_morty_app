import {Injectable, signal, WritableSignal} from '@angular/core';
import {httpResource, HttpResourceRef} from '@angular/common/http';
import {APIS, FilterResponse, Location, LocationFilterModel} from '../../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly endpoint: string = APIS.RICK_MORTY.LOCATIONS

  private searchParams: WritableSignal<Partial<LocationFilterModel>> = signal<Partial<LocationFilterModel>>({page: 1})

  location: HttpResourceRef<Partial<Location> | FilterResponse<Location> | undefined> = httpResource<Partial<Location> | FilterResponse<Location>>(() => {
    const params = this.searchParams()

    if (params.id) return {
      url: `${this.endpoint}/${params.id}`,
      method: 'GET',
    }

    return {
      url: `${this.endpoint}`,
      method: 'GET',
      params: params
    }
  })

  setLocation = (location: Partial<Location>) => {
    this.searchParams.set(location)
  }
}
