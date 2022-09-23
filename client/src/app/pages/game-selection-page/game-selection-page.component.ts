import { Component, OnInit } from '@angular/core';
import { TimeFormatter } from '@app/classes/time-formatter';
import { GameCard } from '@app/interfaces/game-card';
import { GameCarouselService } from '@app/services/game-carousel.service';

@Component({
    selector: 'app-game-selection-page',
    templateUrl: './game-selection-page.component.html',
    styleUrls: ['./game-selection-page.component.scss'],
})
export class GameSelectionPageComponent implements OnInit {
    gameCards: GameCard[] = [];
    favoriteTheme: string = 'deeppurple-amber-theme';

    constructor(readonly gameCarouselService: GameCarouselService) {}

    ngOnInit(): void {
        this.gameCards = this.gameCarouselService.getCards();
        this.makeCardsSelectMode();
    }

    makeCardsSelectMode(): void {
        this.gameCarouselService.setCardMode();
    }

    formatScoreTime(scoreTime: number): string {
        return TimeFormatter.getMMSSFormat(scoreTime);
    }
}
