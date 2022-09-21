import { Injectable } from '@angular/core';
import { PlayerScore } from '@app/classes/player-score';
import { GameCategory } from '@app/enums/game-category';
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

    private initialiseGameCard(): void {
        const DEFAULT_NB_OF_CARDS = 8;
        const DEFAULT_SCORES: any = [1, 2, 3];
        const soloScores = this.initialiseScores(DEFAULT_SCORES, GameCategory.Solo);
        const multiplayerScores = this.initialiseScores(DEFAULT_SCORES, GameCategory.Multiplayer);

        for (let i = 0; i < DEFAULT_NB_OF_CARDS; i++) {
            const newCard: GameCard = {
                gameInformation: {
                    gameName: 'Game ' + i,
                    imgName: 'game' + i,
                    scoresSolo: soloScores,
                    scoresMultiplayer: multiplayerScores,
                },
                isAdminCard: false,
                isCreated: false,
                isShown: false,
                gameName: `Game Name ${i}`,
                imgSource: 'https://picsum.photos/500',
                scoresSolo: soloScores,
                scoresMultiplayer: multiplayerScores,
            };
            this.gameCards.push(newCard);
        }
    }

    private initialiseScores(score: number[], gameCategory: GameCategory): PlayerScore[] {
        const scores: PlayerScore[] = [];

        for (let i = 0; i < score.length; i++) {
            const arbitraryNb = 5;
            const timeForGame = arbitraryNb * i;
            scores.push(new PlayerScore(`Player ${i}`, timeForGame, gameCategory));
        }
        return scores;
    }
}
