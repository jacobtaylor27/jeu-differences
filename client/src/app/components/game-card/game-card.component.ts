import { Component, Input } from '@angular/core';
import { PlayerScore } from '@app/classes/player-score';
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

    getGameName(): string {
        return this.gameCard.gameInformation.name;
    }

    getImageName(): string {
        return this.gameCard.gameInformation.imgName;
    }

    isAdminCard(): boolean {
        return this.gameCard.isAdminCard;
    }

    getMultiplayerScores(): PlayerScore[] {
        return this.gameCard.gameInformation.scoresMultiplayer;
    }

    getSinglePlayerScores(): PlayerScore[] {
        return this.gameCard.gameInformation.scoresSolo;
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

    onClickDeleteGame(game: GameCard): void {
        this.gameCardService.deleteGame(game);
    }

    onClickResetHighScores(game: GameCard): void {
        this.gameCardService.resetHighScores(game);
    }
}
