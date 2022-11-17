/* eslint-disable @typescript-eslint/no-non-null-assertion -- values are stored in a map and are always present */
import { Component } from '@angular/core';
import { Theme } from '@app/enums/theme';

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

    onClickRestoreDefaultValues(): void {
        this.setGameTime(this.getDefaultGameTime());

        this.setPenaltyTime(this.getDefaultPenaltyTime());

        this.setSuccessTime(this.getDefaultSuccessTime());
    }

    getGameTime(): number {
        return GameConstants.get('gameTime')!;
    }

    setGameTime(value: number): void {
        GameConstants.set('gameTime', value);
    }

    getPenaltyTime(): number {
        return GameConstants.get('penaltyTime')!;
    }

    setPenaltyTime(value: number): void {
        GameConstants.set('penaltyTime', value);
    }

    getSuccessTime(): number {
        return GameConstants.get('successTime')!;
    }

    setSuccessTime(value: number): void {
        GameConstants.set('successTime', value);
    }

    getDefaultGameTime(): number {
        return GameConstantsDefault.get('gameTime')!;
    }

    getDefaultPenaltyTime(): number {
        return GameConstantsDefault.get('penaltyTime')!;
    }

    getDefaultSuccessTime(): number {
        return GameConstantsDefault.get('successTime')!;
    }
}
