import { Injectable } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { GameCardHandlerService } from './game-card-handler.service';

@Injectable({
    providedIn: 'root',
})
export class GameCardService {
    constructor(private readonly gameCardHandlerService: GameCardHandlerService) {}

    deleteGame(game: GameCard) {
        this.gameCardHandlerService.deleteGame(game);
    }

    resetHighScores(game: GameCard) {
        this.gameCardHandlerService.resetHighScores(game);
    }
}
