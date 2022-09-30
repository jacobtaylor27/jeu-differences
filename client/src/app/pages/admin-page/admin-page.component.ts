import { Component, OnInit } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
    favoriteTheme: string = 'deeppurple-amber-theme';
    gameCards: GameCard[] = [];

    constructor(private readonly gameCarouselService: GameCarouselService) {}

    ngOnInit(): void {
        this.gameCards = this.gameCarouselService.getCards();
        this.resetStartingRange();
        this.makeCardsAdminMode();
    }

    makeCardsAdminMode(): void {
        this.gameCarouselService.setCardMode(true);
    }

    resetStartingRange(): void {
        this.gameCarouselService.resetRange();
    }
}
