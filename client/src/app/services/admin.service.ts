import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameConstantsSettingsComponent } from '@app/components/game-constants-settings/game-constants-settings.component';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private readonly matDialog: MatDialog) { }

  openGameSettingsDialog(): void {
    this.matDialog.open(GameConstantsSettingsComponent);
  }
}
