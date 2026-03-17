import {Component, computed, effect, inject, input} from '@angular/core';
import {Card} from "../../shared/card/card";
import {CharactersService} from '../../core/services/characters/characters-service';
import {APP_ROUTES, Character, CharactersFilter, FilterResponse} from '../../shared/models';
import {RouterLink} from '@angular/router';
import {CharacterFilter} from './components/character-filter/character-filter';
import {NotFound} from '../not-found/not-found';

@Component({
  selector: 'app-characters',
  imports: [
    Card,
    RouterLink,
    CharacterFilter,
    NotFound
  ],
  templateUrl: './characters.html',
  styleUrl: './characters.scss',
})
export class Characters {
  readonly charService = inject(CharactersService);

  // El transform ya garantiza que 'page' sea siempre un número válido >= 1
  page = input.required({
    transform: (value: string | number): number => {
      const parsed = Number(value);
      return isNaN(parsed) || parsed < 1 ? 1 : parsed;
    }
  });

  name = input<string>();
  species = input<string>();
  gender = input<string>();
  type = input<string>();
  status = input<string>();

  params = computed<Partial<CharactersFilter>>(() => {
    const query: Partial<CharactersFilter> = { page: this.page() };

    if (this.name()) query.name = this.name();
    if (this.species()) query.species = this.species();
    if (this.type()) query.type = this.type();
    if (this.status()) query.status = this.status() as CharactersFilter['status'];
    if (this.gender()) query.gender = this.gender() as CharactersFilter['gender'];

    return query;
  });

  nextPageParams = computed<Partial<CharactersFilter>>(() => ({
    ...this.params(),
    page: this.page() + 1
  }));

  prevPageParams = computed<Partial<CharactersFilter>>(() => ({
    ...this.params(),
    page: Math.max(1, this.page() - 1) // Protección extra para no bajar de 1
  }));

  constructor() {
    // Sincroniza el servicio con los parámetros de la URL
    effect(() => this.charService.setCharacter(this.params()));
  }

  isList(data: any): data is FilterResponse<Character>{
    return data && 'results' in data;
  }

  protected readonly APP_ROUTES = APP_ROUTES;
}
