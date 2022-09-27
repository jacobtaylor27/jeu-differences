import { Injectable } from '@angular/core';
import { Score } from '@common/score';
import { GameCard } from '@app/interfaces/game-card';
import { CardRange } from '@app/interfaces/range';

@Injectable({
    providedIn: 'root',
})
export class GameCardHandlerService {
    private activeCardsRange: CardRange = { start: 0, end: 3 };
    private gameCards: GameCard[] = [];

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

    getActiveCardsRange(): CardRange {
        return this.activeCardsRange;
    }

    getNumberOfCards(): number {
        return this.gameCards.length;
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
        for (let i = this.gameCards.length - 1; i >= 0; i--) {
            this.gameCards.splice(i, 1);
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

    // will be removed once we have a proper database access
    generateFakeCards(): GameCard[] {
        const DEFAULT_NB_OF_CARDS = 18;
        const DEFAULT_SCORES: number[] = [1, 2, 3];
        const soloScores = this.initializeScores(DEFAULT_SCORES);
        const multiplayerScores = this.initializeScores(DEFAULT_SCORES);
        const cards: GameCard[] = [];

        for (let i = 0; i < DEFAULT_NB_OF_CARDS; i++) {
            const newCard: GameCard = {
                gameInformation: {
                    name: 'Game ' + i,
                    // image from api of correct size
                    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                    imgName: `https://picsum.photos/id/${i * 8}/640/480`,
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

    // will be removed or modified once we have a proper database access
    initializeScores(score: number[]): Score[] {
        const scores: Score[] = [];

        for (let i = 0; i < score.length; i++) {
            const arbitraryNb = 5;
            scores.push({
                playersName: 'Player ' + i,
                time: score[i] * arbitraryNb,
            });
        }

        return scores;
    }
}
