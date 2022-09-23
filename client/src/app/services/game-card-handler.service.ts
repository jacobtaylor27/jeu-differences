import { Injectable } from '@angular/core';
import { PlayerScore } from '@app/classes/player-score';
import { GameCategory } from '@app/enums/game-category';
import { GameCard } from '@app/interfaces/game-card';
import { CardRange } from '@app/interfaces/range';

@Injectable({
    providedIn: 'root',
})
export class GameCardHandlerService {
    private ActiveCardsRange: CardRange = { start: 0, end: 3 };
    private GameCards: GameCard[] = [];

    constructor() {
        this.fetchGameCards();
        this.setActiveCards(this.ActiveCardsRange);
    }

    get activeCardsRange(): { start: number; end: number } {
        return this.ActiveCardsRange;
    }

    get gameCards(): GameCard[] {
        return this.GameCards;
    }

    fetchGameCards(): void {
        // generate fake cards until we have a proper database access
        this.GameCards = this.generateFakeCards();
    }

    hideAllCards(): void {
        for (const gameCard of this.GameCards) {
            gameCard.isShown = false;
        }
    }

    increaseActiveRange(): void {
        this.ActiveCardsRange.start += 4;
        this.ActiveCardsRange.end += 4;
    }

    decreaseActiveRange(): void {
        this.ActiveCardsRange.start -= 4;
        this.ActiveCardsRange.end -= 4;
    }

    getActiveCards(): GameCard[] {
        return this.GameCards.filter((gameCard) => gameCard.isShown === true);
    }

    setActiveCards(range: CardRange): void {
        this.hideAllCards();

        if (this.GameCards.length <= range.end) {
            range.end = this.GameCards.length - 1;
        }

        for (let i = range.start; i <= range.end; i++) {
            this.GameCards[i].isShown = true;
        }
    }

    resetActiveRange(): void {
        this.ActiveCardsRange.start = 0;
        this.ActiveCardsRange.end = 3;
        this.setActiveCards(this.ActiveCardsRange);
    }

    deleteGames(): void {
        for (const card of this.GameCards) {
            this.deleteGame(card);
        }
    }

    deleteGame(game: GameCard): void {
        const index = this.GameCards.indexOf(game);
        this.GameCards.splice(index, 1);
        this.resetActiveRange();
    }

    resetHighScores(game: GameCard) {
        const index = this.GameCards.indexOf(game);
        this.GameCards[index].gameInformation.scoresMultiplayer = [];
        this.GameCards[index].gameInformation.scoresSolo = [];
    }

    resetAllHighScores(): void {
        for (const card of this.GameCards) {
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
                isCreated: false,
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
