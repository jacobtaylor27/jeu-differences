import { Component, Input } from '@angular/core';
import { TimeFormatter } from '@app/classes/time-formatter';
import { GameCard } from '@app/interfaces/game-card';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent {
  constructor() { }

  @Input() gameCard: GameCard;

  favoriteTheme: string = 'deeppurple-amber-theme';

  formatScoreTime(scoreTime: number): string {
    return TimeFormatter.getMMSSFormat(scoreTime);
  }
}
