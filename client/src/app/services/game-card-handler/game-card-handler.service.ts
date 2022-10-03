import { HttpResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { CardRange } from '@app/interfaces/range';
import { GameInfo } from '@common/game-info';
import { CommunicationService } from '../communication.service';

@Injectable({
    providedIn: 'root',
})
export class GameCardHandlerService implements OnInit {
    private activeCardsRange: CardRange = { start: 0, end: 3 };
    private gameCards: GameCard[] = [];
    gamesInfo: GameInfo[];

    constructor(private readonly communicationService: CommunicationService) {}

    ngOnInit(): void {
        // this.fetchGameInformation();
        // this.mapInformationToGameCard();
        // this.setActiveCards(this.activeCardsRange);
    }

    fetchGameInformation(): void {
        this.communicationService.getAllGameInfos().subscribe((response: HttpResponse<{ games: GameInfo[] }>) => {
            if (!response || !response.body) {
                return;
            }
            console.log('ALLO');
            this.gamesInfo = response.body.games;
        });
    }

    mapInformationToGameCard() {
        for (const gameInfo of this.gamesInfo) {
            const newCard: GameCard = {
                gameInformation: gameInfo,
                isAdminCard: false,
                isShown: false,
            };
            this.gameCards.push(newCard);
        }
        console.log(this.gameCards);
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
        this.gameCards[index].gameInformation.multiplayerScore = [];
        this.gameCards[index].gameInformation.soloScore = [];
    }

    resetAllHighScores(): void {
        for (const card of this.gameCards) {
            this.resetHighScores(card);
        }
    }
}
