import { Component } from '@angular/core';
import { TimeFormatter } from '@app/classes/time-formatter';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';

@Component({
    selector: 'app-game-selection-page',
    templateUrl: './game-selection-page.component.html',
    styleUrls: ['./game-selection-page.component.scss'],
})
export class GameSelectionPageComponent {
    favoriteTheme: string = 'deeppurple-amber-theme';

    constructor(readonly gameCarouselService: GameCarouselService) {}

    getNumberOfGames(): number {
        return this.gameCarouselService.getCarouselLength();
    }

    hasGames(): boolean {
        return this.gameCarouselService.hasCards();
    }

    formatScoreTime(scoreTime: number): string {
        return TimeFormatter.getMMSSFormat(scoreTime);
    }
}
