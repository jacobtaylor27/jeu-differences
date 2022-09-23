import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameCard } from '@app/interfaces/game-card';
import { AdminService } from '@app/services/admin.service';
import { GameConstantsSettingsComponent } from '../game-constants-settings/game-constants-settings.component';

@Component({
    selector: 'app-admin-commands',
    templateUrl: './admin-commands.component.html',
    styleUrls: ['./admin-commands.component.scss'],
})
export class AdminCommandsComponent {
    favoriteTheme: string = 'deeppurple-amber-theme';

    constructor(private readonly matDialog: MatDialog, private readonly adminService: AdminService) {}

    getGameCards(): GameCard[] {
        return this.adminService.GameCards;
    }

    onClickModifySettings(): void {
        this.matDialog.open(GameConstantsSettingsComponent);
    }

    onClickDeleteGames(): void {
        this.adminService.deleteAllGames();
    }

    onClickResetHighScores(): void {
        this.adminService.resetAllHighScores();
    }
}
