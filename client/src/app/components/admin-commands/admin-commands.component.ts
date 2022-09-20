import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameConstantsSettingsComponent } from '../game-constants-settings/game-constants-settings.component';

@Component({
  selector: 'app-admin-commands',
  templateUrl: './admin-commands.component.html',
  styleUrls: ['./admin-commands.component.scss']
})
export class AdminCommandsComponent {
  constructor(private readonly matDialog: MatDialog) { }

  favoriteTheme: string = 'deeppurple-amber-theme';

  onClickCreateGame(): void { 
  }

  onClickModifySettings(): void {
    this.matDialog.open(GameConstantsSettingsComponent)
  }

  onClickDeleteGames(): void {

  }

  onClickResetHighScores(): void {
    
  }
}
