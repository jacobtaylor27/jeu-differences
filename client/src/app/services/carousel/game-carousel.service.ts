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

    getCarouselLength(): number {
        return this.gameCardHandlerService.getNumberOfCards();
    }

    resetRange(): void {
        this.gameCardHandlerService.resetActiveRange();
    }

    setCardMode(makeAdmin: boolean = false): void {
        this.gameCardHandlerService.getGameCards().forEach((gameCard) => {
            gameCard.isAdminCard = makeAdmin;
        });
    }

    hasCards(): boolean {
        return this.gameCardHandlerService.hasCards();
    }

    hasPreviousCards(): boolean {
        return this.gameCardHandlerService.getActiveCardsRange().start > 0;
    }

    hasNextCards(): boolean {
        return this.gameCardHandlerService.getActiveCardsRange().end < this.gameCardHandlerService.getNumberOfCards() - 1;
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
