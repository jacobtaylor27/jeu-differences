import { Injectable } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';

@Injectable({
    providedIn: 'root',
})
export class GameSelectionService {
    activeCardsRange = { start: 0, end: 3 };
    gameCards: GameCard[] = [];

    constructor() {
        this.initialiseGameCard();
        this.setActiveCards(this.activeCardsRange.start, this.activeCardsRange.end);
    }

    hasPreviousCards(): boolean {
        return this.activeCardsRange.start > 0;
    }

    hasNextCards(): boolean {
        return this.activeCardsRange.end < this.gameCards.length - 1;
    }

    setActiveCards(start: number, end: number): void {
        this.hideAllCards();

        if (this.gameCards.length <= end) {
            end = this.gameCards.length - 1;
        }

        for (let i = start; i <= end; i++) {
            this.gameCards[i].isShown = true;
        }
    }

    hideAllCards(): void {
        for (const gameCard of this.gameCards) {
            gameCard.isShown = false;
        }
    }

    getActiveCards(): GameCard[] {
        return this.gameCards.filter((gameCard) => gameCard.isShown === true);
    }

    showPreviousFour(): void {
        this.decreaseActiveRange();
        this.setActiveCards(this.activeCardsRange.start, this.activeCardsRange.end);
    }

    showNextFour(): void {
        this.increaseActiveRange();
        this.setActiveCards(this.activeCardsRange.start, this.activeCardsRange.end);
    }

    increaseActiveRange(): void {
        this.activeCardsRange.start += 4;
        this.activeCardsRange.end += 4;
    }

    decreaseActiveRange(): void {
        this.activeCardsRange.start -= 4;
        this.activeCardsRange.end -= 4;
    }

    private initialiseGameCard(): void {}
}
