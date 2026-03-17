import {Component, input} from '@angular/core';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {
  title = input<string>('Dimensión No Encontrada');
  message = input<string>('La ruta solicitada no existe en esta línea temporal.');
  showButton = input<boolean>(true);
}
