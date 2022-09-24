import { Injectable } from '@angular/core';
import { PlayerScore } from '@app/classes/player-score';
import { GameCategory } from '@app/enums/game-category';
import { GameCard } from '@app/interfaces/game-card';
import { CardRange } from '@app/interfaces/range';

@Injectable({
    providedIn: 'root',
})
export class GameCardHandlerService {
    activeCardsRange: CardRange = { start: 0, end: 3 };
    gameCards: GameCard[] = [];

    constructor() {
        this.fetchGameCards();
        this.setActiveCards(this.activeCardsRange);
    }

    fetchGameCards(): void {
        // generate fake cards until we have a proper database access
        this.gameCards = this.generateFakeCards();
    }

    getGameCards(): GameCard[] {
        return this.gameCards;
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

        if (this.gameCards.length <= range.end) {
            range.end = this.gameCards.length - 1;
        }

        for (let i = range.start; i <= range.end; i++) {
            this.gameCards[i].isShown = true;
        }
    }

    resetActiveRange(): void {
        this.activeCardsRange.start = 0;
        this.activeCardsRange.end = 3;
        this.setActiveCards(this.activeCardsRange);
    }

    deleteGames(): void {
        for (const card of this.gameCards) {
            this.deleteGame(card);
        }
    }

    deleteGame(game: GameCard): void {
        const index = this.gameCards.indexOf(game);
        this.gameCards.splice(index, 1);
        this.resetActiveRange();
    }

    resetHighScores(game: GameCard) {
        const index = this.gameCards.indexOf(game);
        this.gameCards[index].gameInformation.scoresMultiplayer = [];
        this.gameCards[index].gameInformation.scoresSolo = [];
    }

    resetAllHighScores(): void {
        for (const card of this.gameCards) {
            this.resetHighScores(card);
        }
    }

    generateFakeCards(): GameCard[] {
        const DEFAULT_NB_OF_CARDS = 18;
        const DEFAULT_SCORES: number[] = [1, 2, 3];
        const soloScores = this.initializeScores(DEFAULT_SCORES, GameCategory.Solo);
        const multiplayerScores = this.initializeScores(DEFAULT_SCORES, GameCategory.Multiplayer);
        const cards: GameCard[] = [];

        for (let i = 0; i < DEFAULT_NB_OF_CARDS; i++) {
            const newCard: GameCard = {
                gameInformation: {
                    gameName: 'Game ' + i,
                    imgName: 'https://picsum.photos/200/300',
                    scoresSolo: soloScores,
                    scoresMultiplayer: multiplayerScores,
                },
                isAdminCard: false,
                isShown: false,
            };
            cards.push(newCard);
        }

        return cards;
    }

    initializeScores(score: number[], gameCategory: GameCategory): PlayerScore[] {
        const scores: PlayerScore[] = [];

        for (let i = 0; i < score.length; i++) {
            const arbitraryNb = 5;
            const timeForGame = arbitraryNb * i;
            scores.push(new PlayerScore(`Player ${i}`, timeForGame, gameCategory));
        }

        return scores;
    }
}
