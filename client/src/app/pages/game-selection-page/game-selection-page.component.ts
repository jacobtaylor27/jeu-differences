import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameCardComponent } from '@app/components/game-card/game-card.component';
import { Vec2 } from '@app/interfaces/vec2';

@Component({
  selector: 'app-game-selection-page',
  templateUrl: './game-selection-page.component.html',
  styleUrls: ['./game-selection-page.component.scss']
})
export class GameSelectionPageComponent implements OnInit{
  constructor(private readonly matDialog: MatDialog) {}

  favoriteTheme: string = 'deeppurple-amber-theme';
  currentRange: Vec2;

  gameCards: GameCardComponent[] = [];

  ngOnInit(): void {
    this.populateGameCards();
    this.currentRange = { x: 0, y: 4 };
    this.showFirstFour();
  }

  populateGameCards(): void {
    for (let i = 0; i < 12; i++) {
      this.gameCards.push(new GameCardComponent(this.matDialog));
    }
  }

  showFirstFour(): void {
    for (let i = this.currentRange.x; i < this.currentRange.y; i++) {
      this.gameCards[i].isShown = true;
    }
  }

  hideAllCards(): void {
    for (let i = 0; i < this.gameCards.length; i++) {
      this.gameCards[i].isShown = false;
    }
  }

  showFourCards(startIndex: number, endIndex: number): void {
    for (let i = this.currentRange.x; i < this.currentRange.y; i++) {
      this.gameCards[i].isShown = true;
    }
  }

  showNextFour(): void {}

  showPreviousFour(): void {}

  onClickPrevious(): void {
    this.showPreviousFour();
  }

  onClickNext(): void {
    this.showNextFour();
  }
}
