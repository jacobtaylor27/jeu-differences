import { Component } from '@angular/core';
import { AdminService } from '@app/services/admin-service/admin.service';
import { RouterService } from '@app/services/router-service/router.service';

@Component({
    selector: 'app-admin-commands',
    templateUrl: './admin-commands.component.html',
    styleUrls: ['./admin-commands.component.scss'],
})
export class AdminCommandsComponent {
    favoriteTheme: string = 'deeppurple-amber-theme';

    constructor(private readonly adminService: AdminService, private readonly router: RouterService) {}

    hasCards(): boolean {
        return this.adminService.hasCards();
    }

    onClickModifySettings(): void {
        this.adminService.openSettings();
    }

    onClickDeleteGames(): void {
        this.adminService.deleteAllGames();
        this.router.reloadPage('admin');
    }
}
