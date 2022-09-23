import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

    constructor(readonly gameCarouselService: GameCarouselService, private readonly matDialog: MatDialog) {}

    ngOnInit(): void {
        this.gameCards = this.gameCarouselService.getCards();
        this.makeCardsSelectMode();
    }

    makeCardsSelectMode(): void {
        this.gameCarouselService.setCardMode();
    }

    yo() {
        this.matDialog.open(GameSelectionPageComponent);
    }

    formatScoreTime(scoreTime: number): string {
        return TimeFormatter.getMMSSFormat(scoreTime);
    }
}
