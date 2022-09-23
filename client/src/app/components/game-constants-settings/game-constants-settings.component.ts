import { Component } from '@angular/core';
import { HINT_PENALTY_TIME, SUCCESSFUL_ANSWER_TIME_BONUS, TIMER_TIME } from '@app/constants/game-constants';
import { AdminService } from '@app/services/admin.service';

@Component({
    selector: 'app-game-constants-settings',
    templateUrl: './game-constants-settings.component.html',
    styleUrls: ['./game-constants-settings.component.scss'],
})
export class GameConstantsSettingsComponent {
    favoriteTheme: string = 'deeppurple-amber-theme';
    hintPenaltyTime: number;
    successfulGuessBonusTime: number;
    timerTime: number;

    constructor(private readonly adminService: AdminService) {}

    resetGameConstants(): void {
        this.hintPenaltyTime = this.adminService.gameConstants.hintPenaltyTime;
        this.successfulGuessBonusTime = this.adminService.gameConstants.successfulAttemptTime;
        this.timerTime = this.adminService.gameConstants.defaultTime;
    }

    onClickRestoreDefaults(): void {
        this.hintPenaltyTime = HINT_PENALTY_TIME;
        this.successfulGuessBonusTime = SUCCESSFUL_ANSWER_TIME_BONUS;
        this.timerTime = TIMER_TIME;
    }
}
