import { Injectable } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { GameCardHandlerService } from './game-card-handler.service';

@Injectable({
    providedIn: 'root',
})
export class GameSelectionService {
    gameCards: GameCard[] = [];

    constructor(private readonly gameCardHandlerService: GameCardHandlerService) {
        this.gameCards = this.gameCardHandlerService.gameCards;
    }
}
