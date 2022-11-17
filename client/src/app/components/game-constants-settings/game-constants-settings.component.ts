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
export class GameConstantsSettingsComponent implements OnInit {
    favoriteTheme: string = Theme.ClassName;
    gameTimeConstants: GameTimeConstants = {
        gameTime: DEFAULT_GAME_TIME,
        penaltyTime: DEFAULT_PENALTY_TIME,
        successTime: DEFAULT_SUCCESS_TIME,
    };

    constructor(private readonly communicationService: CommunicationService) {}

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

    setGameTimeConstants(isDefault: boolean = false): void {
        const timeConstants = isDefault
            ? { gameTime: DEFAULT_GAME_TIME, penaltyTime: DEFAULT_PENALTY_TIME, successTime: DEFAULT_SUCCESS_TIME }
            : this.gameTimeConstants;

        this.communicationService.setGameTimeConstants(timeConstants).subscribe();
    }

    getConstants(): void {
        this.communicationService.getGameTimeConstants().subscribe((gameTimeConstants) => {
            if (gameTimeConstants && gameTimeConstants.body) {
                this.gameTimeConstants = gameTimeConstants.body;
            }
        });
    }

    isDefaultValues(): boolean {
        return (
            this.gameTimeConstants.gameTime === DEFAULT_GAME_TIME &&
            this.gameTimeConstants.penaltyTime === DEFAULT_PENALTY_TIME &&
            this.gameTimeConstants.successTime === DEFAULT_SUCCESS_TIME
        );
    }
}
