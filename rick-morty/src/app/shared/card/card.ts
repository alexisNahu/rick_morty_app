import {Component, inject, input} from '@angular/core';
import {CharactersService} from '../../core/services/characters/characters-service';
import {APP_ROUTES, Character} from '../models';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [
    RouterLink
  ],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  readonly character = input.required<Character>();
  protected readonly APP_ROUTES = APP_ROUTES;
}
