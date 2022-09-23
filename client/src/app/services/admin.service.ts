import { Injectable } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { GameConstants } from '@app/interfaces/game-constants';
import { GameCardHandlerService } from './game-card-handler.service';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    private gameCards: GameCard[] = [];
    private gameConstants: GameConstants;

    constructor(private readonly gameCardHandlerService: GameCardHandlerService) {
        this.gameCards = this.gameCardHandlerService.GameCards;
    }

    get GameConstants(): GameConstants {
        return this.gameConstants;
    }

    get GameCards(): GameCard[] {
        return this.gameCards;
    }

    deleteAllGames(): void {
        this.gameCardHandlerService.deleteGames();
    }

    resetAllHighScores(): void {
        this.gameCardHandlerService.resetAllHighScores();
    }
}
