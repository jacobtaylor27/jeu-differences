import { Component, Input } from '@angular/core';
import { Score } from '@common/score';
import { TimeFormatter } from '@app/classes/time-formatter';
import { GameCard } from '@app/interfaces/game-card';

@Component({
    selector: 'app-game-card',
    templateUrl: './game-card.component.html',
    styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent {
    @Input() gameCard: GameCard;
    favoriteTheme: string = 'deeppurple-amber-theme';

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

    getMultiplayerScores(): Score[] {
        return this.gameCard.gameInformation.scoresMultiplayer;
    }

    getSinglePlayerScores(): Score[] {
        return this.gameCard.gameInformation.scoresSolo;
    }

    hasMultiplayerScores(): boolean {
        return this.gameCard.gameInformation.scoresMultiplayer.length > 0;
    }

    hasSinglePlayerScores(): boolean {
        return this.gameCard.gameInformation.scoresSolo.length > 0;
    }
}
