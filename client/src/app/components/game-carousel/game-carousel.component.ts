import { Component, Input } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';

@Component({
  selector: 'app-game-carousel',
  templateUrl: './game-carousel.component.html',
  styleUrls: ['./game-carousel.component.scss']
})
export class GameCarouselComponent {
  constructor() { }

  favoriteTheme: string = 'deeppurple-amber-theme';
  @Input() gameCards: GameCard[] = [];
}
