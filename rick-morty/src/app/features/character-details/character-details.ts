import {Component, computed, effect, inject, input} from '@angular/core';
import {CharactersService} from '../../core/services/characters/characters-service';
import {Character} from '../../shared/models';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-character-details',
  imports: [
    DatePipe
  ],
  templateUrl: './character-details.html',
  styleUrl: './character-details.scss',
})
export class CharacterDetails {
  id = input.required<string>()

  readonly charService = inject(CharactersService)

  character = computed(() => {
    const data = this.charService.character.value()

    if (data && 'id' in data) {
      return data as Character
    }

    return null
  })

  constructor() {
    effect(() => {
      this.charService.setCharacter({id: this.id()})
    })
  }
}
