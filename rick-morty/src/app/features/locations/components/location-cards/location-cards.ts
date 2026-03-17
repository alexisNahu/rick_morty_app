import {Component, input} from '@angular/core';
import {APP_ROUTES, Location} from '../../../../shared/models';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-location-cards',
    imports: [
        RouterLink
    ],
  templateUrl: './location-cards.html',
  styleUrl: './location-cards.scss',
})
export class LocationCards {
  readonly location = input.required<Location>();
  protected readonly APP_ROUTES = APP_ROUTES;
}
