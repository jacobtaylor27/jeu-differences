import { Component, OnInit } from '@angular/core';
import { TimeFormatter } from '@app/classes/time-formatter';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';

@Component({
    selector: 'app-game-selection-page',
    templateUrl: './game-selection-page.component.html',
    styleUrls: ['./game-selection-page.component.scss'],
})
export class GameSelectionPageComponent implements OnInit {
    favoriteTheme: string = 'deeppurple-amber-theme';

    constructor(readonly gameCarouselService: GameCarouselService) {}

    ngOnInit(): void {
        this.gameCarouselService.fetchCardsFromServer();
        this.makeCardsSelectMode();
    }

    getNumberOfGames(): number {
        return this.gameCarouselService.getCarouselLength();
    }

    hasGames(): boolean {
        return this.gameCarouselService.hasCards();
    }

    makeCardsSelectMode(): void {
        this.gameCarouselService.setCardMode();
    }

    formatScoreTime(scoreTime: number): string {
        return TimeFormatter.getMMSSFormat(scoreTime);
    }
}
