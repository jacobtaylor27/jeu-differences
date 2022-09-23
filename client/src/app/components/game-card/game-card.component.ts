import { Component, Input } from '@angular/core';
import { TimeFormatter } from '@app/classes/time-formatter';
import { GameCard } from '@app/interfaces/game-card';
import { GameCardService } from '@app/services/game-card.service';

@Component({
    selector: 'app-game-card',
    templateUrl: './game-card.component.html',
    styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent {
    @Input() gameCard: GameCard;
    favoriteTheme: string = 'deeppurple-amber-theme';

    constructor(private readonly gameCardService: GameCardService) {}

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
        this.gameCardService.openNameDialog();
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
