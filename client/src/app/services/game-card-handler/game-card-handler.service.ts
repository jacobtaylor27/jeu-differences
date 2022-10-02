/* eslint-disable @typescript-eslint/no-magic-numbers */
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

    hasNextCards(): boolean {
        return this.activeCardsRange.end < this.gameCards.length - 1;
    }

    hasPreviousCards(): boolean {
        return this.activeCardsRange.start > 0;
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
                    // imgName: `https://picsum.photos/id/${i * 8}/640/480`,
                    imgName: this.createImage(),
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

    createImage(): string {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        const imageData = new ImageData(640, 480);
        for (let i = 0; i < imageData.data.length; i += 4) {
            // Percentage in the x direction, times 255
            const x = ((i % 400) / 200) * 255;
            // Percentage in the y direction, times 255
            const y = (Math.ceil(i / 200) / 100) * 255;

            // Modify pixel data
            imageData.data[i + 0] = x;
            imageData.data[i + 1] = y;
            imageData.data[i + 2] = 255 - x;
            imageData.data[i + 3] = 255;
        }

        ctx?.putImageData(imageData, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        return dataUrl.replace(/^data:image\/(png|jpg);base64,/, '');
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
