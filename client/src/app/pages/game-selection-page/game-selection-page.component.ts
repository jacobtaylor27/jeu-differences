import { Component, OnInit } from '@angular/core';
import { TimeFormatter } from '@app/classes/time-formatter';
import { GameCard } from '@app/interfaces/game-card';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';
import { GameInfosService } from '@app/services/game-infos-handler/game-infos.service';

@Component({
    selector: 'app-game-selection-page',
    templateUrl: './game-selection-page.component.html',
    styleUrls: ['./game-selection-page.component.scss'],
})
export class GameSelectionPageComponent implements OnInit {
    gameCards: GameCard[] = [];
    favoriteTheme: string = 'deeppurple-amber-theme';

    constructor(readonly gameCarouselService: GameCarouselService, gameInfosService: GameInfosService) {}

    ngOnInit(): void {
        this.gameCards = this.gameCarouselService.getCards();
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
