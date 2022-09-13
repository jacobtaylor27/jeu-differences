import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameCardComponent } from '@app/components/game-card/game-card.component';

@Component({
  selector: 'app-game-selection-page',
  templateUrl: './game-selection-page.component.html',
  styleUrls: ['./game-selection-page.component.scss']
})
export class GameSelectionPageComponent {
  constructor(private readonly matDialog: MatDialog) {}

  favoriteTheme: string = 'deeppurple-amber-theme';
  name:string;

  gameCards: GameCardComponent[] = [
    new GameCardComponent(this.matDialog),
    new GameCardComponent(this.matDialog),
    new GameCardComponent(this.matDialog),
    new GameCardComponent(this.matDialog)
  ];
}
