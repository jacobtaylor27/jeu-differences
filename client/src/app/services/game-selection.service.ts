import { Injectable } from '@angular/core';
import { GameCard } from '@app/classes/game-card';
import { Score } from '@app/classes/score';
import { GameCategory } from '@app/enums/game-category';

@Injectable({
  providedIn: 'root'
})
export class GameSelectionService {
  // fake game cards
  gameInformation = [
    {
      gameName: 'Game Name 1',
      imgSource: 'https://picsum.photos/500',
      scoresSolo: [
        new Score('Player 1', 620, GameCategory.Solo),
        new Score('Player 2', 78, GameCategory.Solo),
        new Score('Player 3', 32, GameCategory.Solo)
      ],
      scoresMultiplayer: [
        new Score('Player X', 122, GameCategory.Multiplayer),
        new Score('Player Y', 88, GameCategory.Multiplayer),
        new Score('Player Z', 54, GameCategory.Multiplayer)
      ],
    },
    {
      gameName: 'Game Name 2',
      imgSource: 'https://picsum.photos/500',
      scoresSolo: [
        new Score('Player 1', 620, GameCategory.Solo),
        new Score('Player 2', 78, GameCategory.Solo),
        new Score('Player 3', 32, GameCategory.Solo)
      ],
      scoresMultiplayer: [
        new Score('Player X', 122, GameCategory.Multiplayer),
        new Score('Player Y', 88, GameCategory.Multiplayer),
        new Score('Player Z', 54, GameCategory.Multiplayer)
      ],
    },
    {
      gameName: 'Game Name 3',
      imgSource: 'https://picsum.photos/500',
      scoresSolo: [
        new Score('Player 1', 620, GameCategory.Solo),
        new Score('Player 2', 78, GameCategory.Solo),
        new Score('Player 3', 32, GameCategory.Solo)
      ],
      scoresMultiplayer: [
        new Score('Player X', 122, GameCategory.Multiplayer),
        new Score('Player Y', 88, GameCategory.Multiplayer),
        new Score('Player Z', 54, GameCategory.Multiplayer)
      ],
    },
    {
      gameName: 'Game Name 4',
      imgSource: 'https://picsum.photos/500',
      scoresSolo: [
        new Score('Player 1', 620, GameCategory.Solo),
        new Score('Player 2', 78, GameCategory.Solo),
        new Score('Player 3', 32, GameCategory.Solo)
      ],
      scoresMultiplayer: [
        new Score('Player X', 122, GameCategory.Multiplayer),
        new Score('Player Y', 88, GameCategory.Multiplayer),
        new Score('Player Z', 54, GameCategory.Multiplayer)
      ],
    },
    {
      gameName: 'Game Name 5',
      imgSource: 'https://picsum.photos/500',
      scoresSolo: [
        new Score('Player 1', 620, GameCategory.Solo),
        new Score('Player 2', 78, GameCategory.Solo),
        new Score('Player 3', 32, GameCategory.Solo)
      ],
      scoresMultiplayer: [
        new Score('Player X', 122, GameCategory.Multiplayer),
        new Score('Player Y', 88, GameCategory.Multiplayer),
        new Score('Player Z', 54, GameCategory.Multiplayer)
      ],
    },
    {
      gameName: 'Game Name 6',
      imgSource: 'https://picsum.photos/500',
      scoresSolo: [
        new Score('Player 1', 620, GameCategory.Solo),
        new Score('Player 2', 78, GameCategory.Solo),
        new Score('Player 3', 32, GameCategory.Solo)
      ],
      scoresMultiplayer: [
        new Score('Player X', 122, GameCategory.Multiplayer),
        new Score('Player Y', 88, GameCategory.Multiplayer),
        new Score('Player Z', 54, GameCategory.Multiplayer)
      ],
    },
    {
      gameName: 'Game Name 7',
      imgSource: 'https://picsum.photos/500',
      scoresSolo: [
        new Score('Player 1', 620, GameCategory.Solo),
        new Score('Player 2', 78, GameCategory.Solo),
        new Score('Player 3', 32, GameCategory.Solo)
      ],
      scoresMultiplayer: [
        new Score('Player X', 122, GameCategory.Multiplayer),
        new Score('Player Y', 88, GameCategory.Multiplayer),
        new Score('Player Z', 54, GameCategory.Multiplayer)
      ],
    },
    {
      gameName: 'Game Name 8',
      imgSource: 'https://picsum.photos/500',
      scoresSolo: [
        new Score('Player 1', 620, GameCategory.Solo),
        new Score('Player 2', 78, GameCategory.Solo),
        new Score('Player 3', 32, GameCategory.Solo)
      ],
      scoresMultiplayer: [
        new Score('Player X', 122, GameCategory.Multiplayer),
        new Score('Player Y', 88, GameCategory.Multiplayer),
        new Score('Player Z', 54, GameCategory.Multiplayer)
      ],
    },
    {
      gameName: 'Game Name 9',
      imgSource: 'https://picsum.photos/500',
      scoresSolo: [
        new Score('Player 1', 620, GameCategory.Solo),
        new Score('Player 2', 78, GameCategory.Solo),
        new Score('Player 3', 32, GameCategory.Solo)
      ],
      scoresMultiplayer: [
        new Score('Player X', 122, GameCategory.Multiplayer),
        new Score('Player Y', 88, GameCategory.Multiplayer),
        new Score('Player Z', 54, GameCategory.Multiplayer)
      ],
    },
    {
      gameName: 'Game Name 10',
      imgSource: 'https://picsum.photos/500',
      scoresSolo: [
        new Score('Player 1', 620, GameCategory.Solo),
        new Score('Player 2', 78, GameCategory.Solo),
        new Score('Player 3', 32, GameCategory.Solo)
      ],
      scoresMultiplayer: [
        new Score('Player X', 122, GameCategory.Multiplayer),
        new Score('Player Y', 88, GameCategory.Multiplayer),
        new Score('Player Z', 54, GameCategory.Multiplayer)
      ],
    },
    {
      gameName: 'Game Name 11',
      imgSource: 'https://picsum.photos/500',
      scoresSolo: [
        new Score('Player 1', 620, GameCategory.Solo),
        new Score('Player 2', 78, GameCategory.Solo),
        new Score('Player 3', 32, GameCategory.Solo)
      ],
      scoresMultiplayer: [
        new Score('Player X', 122, GameCategory.Multiplayer),
        new Score('Player Y', 88, GameCategory.Multiplayer),
        new Score('Player Z', 54, GameCategory.Multiplayer)
      ],
    }
  ];

  activeCardsRange = { start: 0, end: 3 };
  gameCards: GameCard[] = [];

  constructor() {
    this.fetchGameCards();
    this.setActiveCards(this.activeCardsRange.start, this.activeCardsRange.end);
  }

  hasPreviousCards(): boolean {
    return this.activeCardsRange.start > 0;
  }

  hasNextCards(): boolean {
    return this.activeCardsRange.end < this.gameCards.length - 1;
  }

  fetchGameCards(): void {
    this.gameInformation.forEach(gameInformation => {
      let gc = new GameCard();
      gc.gameName = gameInformation.gameName;
      gc.imgSource = gameInformation.imgSource;
      gc.scoresSolo = gameInformation.scoresSolo;
      gc.scoresMultiplayer = gameInformation.scoresMultiplayer;
      this.gameCards.push(gc);
    });
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
    for (let i = 0; i < this.gameCards.length; i++) {
      this.gameCards[i].isShown = false;
    }
  }

  getActiveCards(): Array<GameCard> {
    return this.gameCards.filter(gameCard => gameCard.isShown === true);
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
}
