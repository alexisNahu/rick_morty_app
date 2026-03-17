import {Component, computed, effect, inject, input} from '@angular/core';
import {LocationService} from '../../core/services/location/location-service';
import {Character, Location} from '../../shared/models';
import {DatePipe} from '@angular/common';
import {CharactersService} from '../../core/services/characters/characters-service';
import {Card} from '../../shared/card/card';

@Component({
  selector: 'app-location-details',
  imports: [
    DatePipe,
    Card
  ],
  templateUrl: './location-details.html',
  styleUrl: './location-details.scss',
})
export class LocationDetails {
  id = input.required<string>();

  readonly lcsService = inject(LocationService)
  readonly charService = inject(CharactersService)

  location = computed(() => {
    const data = this.lcsService.location.value()

    if (data && 'id' in data) {
      return data as Location
    }

    return null
  })

  location_characters = computed(() => {
    const data = this.charService.character.value()
    return data as Character[]
  })

  constructor() {
    effect(() => {
      const numericId = Number(this.id())
      this.lcsService.setLocation({id: numericId})
    })
    effect(() => {
      const loc = this.location()
      const ids = loc?.residents.map((url) => {
        return url.split('/').pop()
      }).join(',')
      this.charService.setCharacter({id: ids})
    })
  }
}
