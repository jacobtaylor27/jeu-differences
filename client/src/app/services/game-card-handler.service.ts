import { Injectable } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';

@Injectable({
  providedIn: 'root'
})
export class GameCardHandlerService {
  gamesInformation: any[] = [];
  gameCards: GameCard[] = [];

  constructor() { }

  fetchGamesInformation(): void {}
  generateGameCards(): void {}
  deleteGame(game: GameCard): void {
    const index = this.gameCards.indexOf(game);
    if (index > -1) {
      this.gameCards.splice(index, 1);
    }
  }
}
