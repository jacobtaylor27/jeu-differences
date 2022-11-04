/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Injectable } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { PublicGameInformation } from '@common/game-information';

@Injectable({
    providedIn: 'root',
})
export class GameCardHandlerService {
    gamesInfo: PublicGameInformation[];
    private gameCards: GameCard[] = [];

    getGameCards(): GameCard[] {
        return this.gameCards;
    }

    setCards(cards: GameCard[]) {
        this.gameCards = cards;
    }

    hasNextCards(): boolean {
        // return this.activeCardsRange.end < this.gameCards.length - 1;
        return true;
    }

    hasPreviousCards(): boolean {
        // return this.activeCardsRange.start > 0;
        return false;
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

    setCardMode(isAdmin: boolean = false): void {
        for (const gameCard of this.gameCards) {
            gameCard.isAdminCard = isAdmin;
        }
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
