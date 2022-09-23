import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TimeFormatter } from '@app/classes/time-formatter';
import { GameCard } from '@app/interfaces/game-card';
import { GameCardService } from '@app/services/game-card.service';
import { UserNameInputComponent } from '../user-name-input/user-name-input.component';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent {
  constructor(private readonly matDialog: MatDialog, private readonly gameCardService: GameCardService) { }

  @Input() gameCard: GameCard;

  favoriteTheme: string = 'deeppurple-amber-theme';

  formatScoreTime(scoreTime: number): string {
    return TimeFormatter.getMMSSFormat(scoreTime);
  }

  hasMultiplayerScores(): boolean {
    return this.gameCard.gameInformation.scoresMultiplayer.length > 0;
  }

  hasSinglePlayerScores(): boolean {
    return this.gameCard.gameInformation.scoresSolo.length > 0;
  }

  onClickPlayGame(): void {
    this.matDialog.open(UserNameInputComponent);
  }

  onClickCreateGame(): void {
    // create new game lobby
  }

  onClickDeleteGame(game: GameCard): void {
    this.gameCardService.deleteGame(game);
    // delete game
  }

  onClickResetHighScores(game: GameCard): void {
    // reset highscores
    this.gameCardService.resetHighScores(game);
  }
}
