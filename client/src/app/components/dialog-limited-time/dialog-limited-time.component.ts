import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Theme } from '@app/enums/theme';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { SocketEvent } from '@common/socket-event';
import { NoGameSnackbarComponent } from '@app/components/no-game-snackbar/no-game-snackbar/no-game-snackbar.component';

@Component({
    selector: 'app-dialog-limited-time',
    templateUrl: './dialog-limited-time.component.html',
    styleUrls: ['./dialog-limited-time.component.scss'],
})
export class DialogLimitedTimeComponent {
    favoriteTheme: string = Theme.ClassName;

    constructor(
        private readonly communicationSocketService: CommunicationSocketService,
        private readonly gameInformationHandlerService: GameInformationHandlerService,
        private readonly gameCarouselService: GameCarouselService,
        private readonly snackBar: MatSnackBar,
    ) {}

    onClickSolo() {
        this.communicationSocketService.send(SocketEvent.CreateGame, {
            player: this.gameInformationHandlerService.players[0].name,
            mode: this.gameInformationHandlerService.gameMode,
            game: { card: undefined, isMulti: false },
        });
        this.gameInformationHandlerService.handleSocketEvent();
    }

    onClickCoop() {
        this.communicationSocketService.send(SocketEvent.CreateGameMulti, {
            player: this.gameInformationHandlerService.players[0].name,
            mode: this.gameInformationHandlerService.gameMode,
            game: { card: undefined, isMulti: true },
        });
        this.gameInformationHandlerService.handleSocketEvent();
    }

    noGameAvailable(): boolean {
        if (this.gameCarouselService.getNumberOfCards() === 0) {
            this.openSnackBar();

            return true;
        }
        return false;
    }

    openSnackBar() {
        this.snackBar.openFromComponent(NoGameSnackbarComponent);
    }
}
