import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '@app/services/admin-service/admin.service';

@Component({
    selector: 'app-admin-commands',
    templateUrl: './admin-commands.component.html',
    styleUrls: ['./admin-commands.component.scss'],
})
export class AdminCommandsComponent {
    favoriteTheme: string = 'deeppurple-amber-theme';

    constructor(private readonly adminService: AdminService, private readonly router: Router) {}

    hasCards(): boolean {
        return this.adminService.hasGameCards();
    }

    onClickModifySettings(): void {
        this.adminService.openSettings();
    }

    onClickDeleteGames(): void {
        this.adminService.deleteAllGames();
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/admin']);
        });
    }

    onClickResetHighScores(): void {
        this.adminService.resetAllHighScores();
    }
}
