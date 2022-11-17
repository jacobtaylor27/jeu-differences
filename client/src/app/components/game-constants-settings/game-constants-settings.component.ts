import { Component, OnInit } from '@angular/core';
import { Theme } from '@app/enums/theme';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameTimeConstants } from '@common/game-time-constants';

const DEFAULT_GAME_TIME = 30;
const DEFAULT_PENALTY_TIME = 5;
const DEFAULT_SUCCESS_TIME = 5;

@Component({
    selector: 'app-game-constants-settings',
    templateUrl: './game-constants-settings.component.html',
    styleUrls: ['./game-constants-settings.component.scss'],
})
export class GameConstantsSettingsComponent {
    favoriteTheme: string = Theme.ClassName;
    gameTimeConstants: GameTimeConstants = {
        gameTime: DEFAULT_GAME_TIME,
        penaltyTime: DEFAULT_PENALTY_TIME,
        successTime: DEFAULT_SUCCESS_TIME,
    };

    onClickRestoreDefaultValues(): void {
        this.setGameTime(DEFAULT_GAME_TIME);
    ngOnInit(): void {
        this.getConstants();
    }

    onClickRestoreDefaultValues(): void {
        this.setGameTimeConstants(true);
        this.gameTimeConstants = {
            gameTime: DEFAULT_GAME_TIME,
            penaltyTime: DEFAULT_PENALTY_TIME,
            successTime: DEFAULT_SUCCESS_TIME,
        };
    }

    setGameTime(value: number): void {
        //
    }

    getPenaltyTime(): number {
        //
    }

    setPenaltyTime(value: number): void {
        //
    }

    getSuccessTime(): number {
        //
    }

    isDefaultValues(): boolean {
        return (
            this.gameTimeConstants.gameTime === DEFAULT_GAME_TIME &&
            this.gameTimeConstants.penaltyTime === DEFAULT_PENALTY_TIME &&
            this.gameTimeConstants.successTime === DEFAULT_SUCCESS_TIME
        );
    }
}
