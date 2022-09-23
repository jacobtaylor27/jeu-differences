import { Injectable } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { GameCardHandlerService } from './game-card-handler.service';

@Injectable({
  providedIn: 'root'
})
export class GameCarouselService {
  constructor(private readonly gameCardHandlerService: GameCardHandlerService) {}

  getCards(): GameCard[] {
    return this.gameCardHandlerService.GameCards;
  }

  resetRange(): void {
    this.gameCardHandlerService.resetActiveRange();
  }

  setCardMode(makeAdmin: boolean = false): void {
    this.gameCardHandlerService.GameCards.forEach((gameCard) => {
      gameCard.isAdminCard = makeAdmin;
    });
  }

  hasPreviousCards(): boolean {
    return this.gameCardHandlerService.activeCardsRange.start > 0;
  }

  hasNextCards(): boolean {
    return this.gameCardHandlerService.activeCardsRange.end < this.gameCardHandlerService.GameCards.length - 1;
  }

  showPreviousFour(): void {
    this.gameCardHandlerService.decreaseActiveRange();
    this.gameCardHandlerService.setActiveCards(this.gameCardHandlerService.activeCardsRange.start, this.gameCardHandlerService.activeCardsRange.end);
  }

  showNextFour(): void {
    this.gameCardHandlerService.increaseActiveRange();
    this.gameCardHandlerService.setActiveCards(this.gameCardHandlerService.activeCardsRange.start, this.gameCardHandlerService.activeCardsRange.end);
  }
}
