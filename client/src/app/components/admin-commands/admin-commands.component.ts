import { Component } from '@angular/core';
import { AdminService } from '@app/services/admin.service';

@Component({
  selector: 'app-admin-commands',
  templateUrl: './admin-commands.component.html',
  styleUrls: ['./admin-commands.component.scss']
})
export class AdminCommandsComponent {
  constructor(private readonly adminService: AdminService) { }

  favoriteTheme: string = 'deeppurple-amber-theme';

  onClickCreateGame(): void { 
  }

  onClickModifySettings(): void {
    this.adminService.openGameSettingsDialog();
  }

  onClickDeleteGames(): void {
  }

  onClickResetHighScores(): void {
  }
}
