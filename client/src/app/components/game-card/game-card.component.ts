import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent {
  public gameName:string = "Hello world";
  public imgSource:string;

  public playButton: MatButton;

  constructor() {}
}
