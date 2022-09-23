import { Component } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { AdminService } from '@app/services/admin.service';

@Component({
    selector: 'app-admin-commands',
    templateUrl: './admin-commands.component.html',
    styleUrls: ['./admin-commands.component.scss'],
})
export class AdminCommandsComponent {
    favoriteTheme: string = 'deeppurple-amber-theme';

    constructor(private readonly adminService: AdminService) {}

    getGameCards(): GameCard[] {
        return this.adminService.gameCards;
    }

    onClickModifySettings(): void {
        this.adminService.openSettings();
    }

    onClickDeleteGames(): void {
        this.adminService.deleteAllGames();
    }

    onClickResetHighScores(): void {
        this.adminService.resetAllHighScores();
    }
}
