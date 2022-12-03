import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Theme } from '@app/enums/theme';
import { AdminService } from '@app/services/admin-service/admin.service';

@Component({
    selector: 'app-confirm-delete-dialog',
    templateUrl: './confirm-delete-dialog.component.html',
    styleUrls: ['./confirm-delete-dialog.component.scss'],
})
export class ConfirmDeleteDialogComponent {
    theme: string = Theme.ClassName;

    constructor(private readonly adminService: AdminService) {}

    deleteAllGames(): void {
        this.adminService.deleteAllGames();
    }
}
