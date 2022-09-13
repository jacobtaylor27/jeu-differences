import { Component, ViewChild, TemplateRef } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent {
  @ViewChild('enterNameDialogContentRef')
  private readonly enterNameDialogContentRef: TemplateRef<HTMLElement>;

  constructor(private readonly matDialog: MatDialog) {}

  public gameName:string = "Hello world";
  public imgSource:string = "https://www.w3schools.com/w3css/img_lights.jpg";

  public playButton: MatButton;

  onSelectPlayGame(): void {
    this.matDialog.open(this.enterNameDialogContentRef);
  }

  onSelectCreateGame(): void {
    this.matDialog.open(this.enterNameDialogContentRef);
  }
}
