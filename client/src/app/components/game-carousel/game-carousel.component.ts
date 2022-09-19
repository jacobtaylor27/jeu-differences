import { Component } from '@angular/core';

@Component({
  selector: 'app-game-carousel',
  templateUrl: './game-carousel.component.html',
  styleUrls: ['./game-carousel.component.scss']
})
export class GameCarouselComponent {
  constructor() { }

  favoriteTheme: string = 'deeppurple-amber-theme';
}
