import { Injectable } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { GameCardHandlerService } from '@app/services/game-card-handler/game-card-handler.service';
import { CarouselInformation } from '@common/carousel-information';

@Injectable({
    providedIn: 'root',
})
export class GameCarouselService {
    games: GameCard[] = [];
    carouselInformation: CarouselInformation = {
        currentPage: 0,
        gamesOnPage: 0,
        nbOfGames: 0,
        nbOfPages: 0,
        hasNext: false,
        hasPrevious: false,
    };

    constructor(private readonly gameCardHandlerService: GameCardHandlerService) {}

    getCards(): GameCard[] {
        return this.gameCardHandlerService.getGameCards();
    }

    setCarouselInformation(carouselInfo: CarouselInformation): void {
        this.carouselInformation = carouselInfo;
    }

    getNumberOfCards(): number {
        return this.carouselInformation.nbOfGames;
    }

    hasMoreThanOneCard(): boolean {
        return this.carouselInformation.nbOfGames > 1;
    }

    setCardMode(makeAdmin: boolean = false): void {
        for (const gameCard of this.games) {
            gameCard.isAdminCard = makeAdmin;
        }
    }

    hasCards(): boolean {
        return this.carouselInformation.nbOfGames > 0;
    }

    hasPreviousCards(): boolean {
        return this.carouselInformation.hasPrevious;
    }

    hasNextCards(): boolean {
        return this.carouselInformation.hasNext;
    }
}
