import { Injectable } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { GameCardHandlerService } from './game-card-handler.service';

@Injectable({
    providedIn: 'root',
})
export class GameCarouselService {
    constructor(private readonly gameCardHandlerService: GameCardHandlerService) {}

    getCards(): GameCard[] {
        return this.gameCardHandlerService.gameCards;
    }

    getCarouselLength(): number {
        return this.gameCardHandlerService.gameCards.length;
    }

    resetRange(): void {
        this.gameCardHandlerService.resetActiveRange();
    }

    setCardMode(makeAdmin: boolean = false): void {
        this.gameCardHandlerService.gameCards.forEach((gameCard) => {
            gameCard.isAdminCard = makeAdmin;
        });
    }

    hasCards(): boolean {
        return this.gameCardHandlerService.gameCards.length > 0;
    }

    hasPreviousCards(): boolean {
        return this.gameCardHandlerService.activeCardsRange.start > 0;
    }

    hasNextCards(): boolean {
        return this.gameCardHandlerService.activeCardsRange.end < this.gameCardHandlerService.gameCards.length - 1;
    }

    showPreviousFour(): void {
        this.gameCardHandlerService.decreaseActiveRange();
        this.gameCardHandlerService.setActiveCards(this.gameCardHandlerService.activeCardsRange);
    }

    showNextFour(): void {
        this.gameCardHandlerService.increaseActiveRange();
        this.gameCardHandlerService.setActiveCards(this.gameCardHandlerService.activeCardsRange);
    }
}
