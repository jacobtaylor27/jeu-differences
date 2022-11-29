import { Component } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { Theme } from '@app/enums/theme';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { GameMode } from '@common/game-mode';

@Component({
    selector: 'app-player-left-snackbar',
    templateUrl: './player-left-snackbar.component.html',
    styleUrls: ['./player-left-snackbar.component.scss'],
})
export class PlayerLeftSnackbarComponent {
    theme: typeof Theme = Theme;
    constructor(public snackBarRef: MatSnackBarRef<PlayerLeftSnackbarComponent>, public gameInfoHandlerService: GameInformationHandlerService) {}

    messageSnackBar() {
        if (this.gameInfoHandlerService.gameMode === GameMode.LimitedTime) {
            return 'Le joueur a quitté la partie. Vous jouez maintenant en solo.';
        }
        return 'Le joueur a quitté la partie.';
    }
}
