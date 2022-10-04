import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameConstantsSettingsComponent } from '@app/components/game-constants-settings/game-constants-settings.component';
import { GameConstants } from '@app/interfaces/game-constants';
import { GameCardHandlerService } from '@app/services/game-card-handler/game-card-handler.service';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    gameConstants: GameConstants;

    constructor(private readonly gameCardHandlerService: GameCardHandlerService, private readonly matDialog: MatDialog) {}

    hasGameCards(): boolean {
        return this.gameCardHandlerService.hasCards();
    }

    deleteAllGames(): void {
        this.gameCardHandlerService.deleteGames();
    }

    openSettings(): void {
        this.matDialog.open(GameConstantsSettingsComponent);
    }

    resetAllHighScores(): void {
        this.gameCardHandlerService.resetAllHighScores();
    }
}