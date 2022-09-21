import { Component } from '@angular/core';
import { AdminService } from '@app/services/admin.service';

@Component({
  selector: 'app-game-constants-settings',
  templateUrl: './game-constants-settings.component.html',
  styleUrls: ['./game-constants-settings.component.scss']
})
export class GameConstantsSettingsComponent {
  constructor(private readonly adminService: AdminService) { }

  favoriteTheme: string = 'deeppurple-amber-theme';
  hintPenaltyTime: number;
  successfulGuessBonusTime: number;
  timerTime: number;

  resetGameConstants(): void {
    this.hintPenaltyTime = this.adminService.gameConstants.hintPenaltyTime;
    this.successfulGuessBonusTime = this.adminService.gameConstants.successfulAttemptTime;
    this.timerTime = this.adminService.gameConstants.defaultTime;
  }

  onClickRestoreDefaults(): void {}
}
