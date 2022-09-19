import { Component } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { PlayerScore } from '@app/classes/player-score';
import { GameCategory } from '@app/enums/game-category';

@Component({
  selector: 'app-game-carousel',
  templateUrl: './game-carousel.component.html',
  styleUrls: ['./game-carousel.component.scss']
})
export class GameCarouselComponent {
  constructor() {
    this.fillGameCards();
  }

  favoriteTheme: string = 'deeppurple-amber-theme';
  gameCards: GameCard[] = [];

  fillGameCards(): void {
    for (let i = 0 ; i < 4 ; i++) {
      this.gameCards.push(
        {
          isShown: true,
          isCreated: false,
          gameName: 'Game 1',
          imgSource: 'https://picsum.photos/200/300',
          scoresSolo: [
            new PlayerScore('Player 1', 60, GameCategory.Solo),
            new PlayerScore('Player 2', 120, GameCategory.Solo),
            new PlayerScore('Player 3', 90, GameCategory.Solo),
          ],
          scoresMultiplayer: [
            new PlayerScore('Player X', 60, GameCategory.Multiplayer),
            new PlayerScore('Player Y', 120, GameCategory.Multiplayer),
            new PlayerScore('Player Z', 90, GameCategory.Multiplayer),
          ]
        }
      );
    }
  }
}
