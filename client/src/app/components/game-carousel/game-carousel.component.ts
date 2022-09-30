import { Component, Input, OnInit } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';

@Component({
    selector: 'app-game-carousel',
    templateUrl: './game-carousel.component.html',
    styleUrls: ['./game-carousel.component.scss'],
})
export class GameCarouselComponent implements OnInit {
    @Input() gameCards: GameCard[] = [];
    favoriteTheme: string = 'deeppurple-amber-theme';

    constructor(private readonly gameCarouselService: GameCarouselService) {}

    ngOnInit(): void {
        this.gameCards = this.gameCarouselService.getCards();
        this.resetStartingRange();
    }

    hasCards(): boolean {
        return this.gameCarouselService.hasCards();
    }

    resetStartingRange(): void {
        this.gameCarouselService.resetRange();
    }

    onClickPrevious(): void {
        this.gameCarouselService.showPreviousFour();
    }

    onClickNext(): void {
        this.gameCarouselService.showNextFour();
    }

    hasCardsBefore(): boolean {
        return this.gameCarouselService.hasPreviousCards();
    }

    hasCardsAfter(): boolean {
        return this.gameCarouselService.hasNextCards();
    }
}
