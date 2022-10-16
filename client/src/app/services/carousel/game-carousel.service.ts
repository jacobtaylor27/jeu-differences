import { Injectable } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { GameCardHandlerService } from '@app/services/game-card-handler/game-card-handler.service';

@Injectable({
    providedIn: 'root',
})
export class GameCarouselService {
    constructor(private readonly gameCardHandlerService: GameCardHandlerService) {}

    getCards(): GameCard[] {
        return this.gameCardHandlerService.getGameCards();
    }

    getNumberOfCards(): number {
        return this.gameCardHandlerService.getNumberOfCards();
    }

    hasMoreThanOneCard(): boolean {
        return this.gameCardHandlerService.hasMoreThanOneCard();
    }

    setCards(cards: GameCard[]) {
        this.gameCardHandlerService.setCards(cards);
    }

    getCarouselLength(): number {
        return this.gameCardHandlerService.getNumberOfCards();
    }

    resetRange(): void {
        this.gameCardHandlerService.resetActiveRange();
    }

    setCardMode(makeAdmin: boolean = false): void {
        this.gameCardHandlerService.setCardMode(makeAdmin);
    }

    hasCards(): boolean {
        return this.gameCardHandlerService.hasCards();
    }

    hasPreviousCards(): boolean {
        return this.gameCardHandlerService.hasPreviousCards();
    }

    hasNextCards(): boolean {
        return this.gameCardHandlerService.hasNextCards();
    }

    showPreviousFour(): void {
        this.gameCardHandlerService.decreaseActiveRange();
        this.gameCardHandlerService.setActiveCards(this.gameCardHandlerService.getActiveCardsRange());
    }

    showNextFour(): void {
        this.gameCardHandlerService.increaseActiveRange();
        this.gameCardHandlerService.setActiveCards(this.gameCardHandlerService.getActiveCardsRange());
    }
}
