import { Component, Input } from '@angular/core';
import { TimeFormatter } from '@app/classes/time-formatter';
import { GameCard } from '@app/interfaces/game-card';
import { GameCardService } from '@app/services/game-card.service';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent {
  constructor(private readonly gameCardService: GameCardService) { }

  @Input() gameCard: GameCard;

  favoriteTheme: string = 'deeppurple-amber-theme';

  formatScoreTime(scoreTime: number): string {
    return TimeFormatter.getMMSSFormat(scoreTime);
  }

  hasMultiplayerScores(): boolean {
    return this.gameCard.scoresMultiplayer.length > 0;
  }

  hasSinglePlayerScores(): boolean {
    return this.gameCard.scoresSolo.length > 0;
  }

  onClickPlayGame(): void {
    this.gameCardService.openUseNameInputDialog();
  }

  onClickCreateGame(): void {
    this.gameCardService.openUseNameInputDialog();
  }

  onClickDeleteGame(): void {
    this.gameCardService.openUseNameInputDialog();
  }

  onClickResetHighScores(): void {
    this.gameCardService.openUseNameInputDialog();
  }
}
