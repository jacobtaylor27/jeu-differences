import { Injectable } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { GameCardHandlerService } from './game-card-handler.service';

@Injectable({
    providedIn: 'root',
})
export class GameSelectionService {
    private GameCards: GameCard[] = [];

    constructor(private readonly gameCardHandlerService: GameCardHandlerService) {
        this.GameCards = this.gameCardHandlerService.gameCards;
    }

    get gameCards(): GameCard[] {
        return this.GameCards;
    }
}
