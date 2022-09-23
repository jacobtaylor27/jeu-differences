import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameConstantsSettingsComponent } from '@app/components/game-constants-settings/game-constants-settings.component';
import { GameCard } from '@app/interfaces/game-card';
import { GameConstants } from '@app/interfaces/game-constants';
import { GameCardHandlerService } from './game-card-handler.service';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    gameCards: GameCard[] = [];
    gameConstants: GameConstants;

    constructor(private readonly gameCardHandlerService: GameCardHandlerService, private readonly matDialog: MatDialog) {
        this.gameCards = this.gameCardHandlerService.gameCards;
    }

    hasGameCards(): boolean {
        return this.gameCards.length > 0;
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
