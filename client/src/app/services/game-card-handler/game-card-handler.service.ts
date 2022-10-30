/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Injectable } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { CardRange } from '@app/interfaces/range';
import { PublicGameInformation } from '@common/game-information';

@Injectable({
    providedIn: 'root',
})
export class GameCardHandlerService {
    gamesInfo: PublicGameInformation[];
    private activeCardsRange: CardRange = { start: 0, end: 3 };
    private gameCards: GameCard[] = [];

    getGameCards(): GameCard[] {
        return this.gameCards;
    }

    setCards(cards: GameCard[]) {
        this.gameCards = cards;
    }

    getActiveCardsRange(): CardRange {
        return this.activeCardsRange;
    }

    hasNextCards(): boolean {
        return this.activeCardsRange.end < this.gameCards.length - 1;
    }

    hasPreviousCards(): boolean {
        return this.activeCardsRange.start > 0;
    }

    getNumberOfCards(): number {
        return this.gameCards.length;
    }

    hasMoreThanOneCard(): boolean {
        return this.gameCards.length > 1;
    }

    hasCards(): boolean {
        return this.gameCards.length > 0;
    }

    hideAllCards(): void {
        for (const gameCard of this.gameCards) {
            gameCard.isShown = false;
        }
    }

    increaseActiveRange(): void {
        this.activeCardsRange.start += 4;
        this.activeCardsRange.end += 4;
    }

    decreaseActiveRange(): void {
        this.activeCardsRange.start -= 4;
        this.activeCardsRange.end -= 4;
    }

    getActiveCards(): GameCard[] {
        return this.gameCards.filter((gameCard) => gameCard.isShown === true);
    }

    setActiveCards(range: CardRange): void {
        this.hideAllCards();

        let end = range.end;

        if (range.end > this.gameCards.length - 1) {
            end = this.gameCards.length - 1;
        }

        for (let i = range.start; i <= end; i++) {
            this.gameCards[i].isShown = true;
        }
    }

    setCardMode(isAdmin: boolean = false): void {
        for (const gameCard of this.gameCards) {
            gameCard.isAdminCard = isAdmin;
        }
    }

    resetActiveRange(): void {
        this.activeCardsRange.start = 0;
        this.activeCardsRange.end = 3;
        this.setActiveCards(this.activeCardsRange);
    }

    resetHighScores(game: GameCard) {
        const index = this.gameCards.indexOf(game);
        this.gameCards[index].gameInformation.multiplayerScore = [];
        this.gameCards[index].gameInformation.soloScore = [];
    }

    resetAllHighScores(): void {
        for (const card of this.gameCards) {
            this.resetHighScores(card);
        }
    }
}
