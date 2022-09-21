import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameConstantsSettingsComponent } from '@app/components/game-constants-settings/game-constants-settings.component';
import { GameConstants } from '@app/interfaces/game-constants';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private readonly matDialog: MatDialog) { }

  gameConstants: GameConstants;

  openGameSettingsDialog(): void {
    this.matDialog.open(GameConstantsSettingsComponent);
  }

  deleteAllGames(): void {}
}
