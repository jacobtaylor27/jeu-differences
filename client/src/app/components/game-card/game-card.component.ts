import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

class Scores {
  name: string;
  score: number;
  time: number;

  constructor() {}
}

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent implements OnInit{
  @ViewChild('enterNameDialogContentRef')
  private readonly enterNameDialogContentRef: TemplateRef<HTMLElement>;

  constructor(private readonly matDialog: MatDialog) {}

  public gameName:string = "Game Name";
  public isShown: boolean = false;
  public Scores: Scores[] = [];
  public imgSource:string = "https://www.w3schools.com/w3css/img_lights.jpg";

  onSelectPlayGame(): void {
    this.matDialog.open(this.enterNameDialogContentRef);
  }

  onSelectCreateGame(): void {
    this.matDialog.open(this.enterNameDialogContentRef);
  }

  ngOnInit(): void {}
}
