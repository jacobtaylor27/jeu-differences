import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogGameOverComponent } from '@app/components/dialog-game-over/dialog-game-over.component';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { ExitButtonHandlerService } from '@app/services/exit-button-handler/exit-button-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnDestroy {
    favoriteTheme: string = 'deeppurple-amber-theme';
    clock: string;

    // eslint-disable-next-line max-params
    constructor(
        private dialog: MatDialog,
        public gameInfoHandlerService: GameInformationHandlerService,
        exitButtonService: ExitButtonHandlerService,
        private socket: CommunicationSocketService,
    ) {
        exitButtonService.setGamePage();
        this.handleSocket();
    }
    handleSocket() {
        this.socket.once(SocketEvent.Win, () => this.openGameOverDialog(true));
        this.socket.once(SocketEvent.Lose, () => this.openGameOverDialog(false));
    }

    openGameOverDialog(isWin: boolean) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = '50%';
        dialogConfig.data = {
            win: isWin,
            winner: isWin ? this.gameInfoHandlerService.getPlayer().name : this.gameInfoHandlerService.getOpponent().name,
        };
        this.dialog.open(DialogGameOverComponent, dialogConfig);
    }

    ngOnDestroy(): void {
        this.socket.send(SocketEvent.LeaveGame, { gameId: this.gameInfoHandlerService.roomId });
        this.socket.off(SocketEvent.Win);
        this.socket.off(SocketEvent.Lose);
    }
}
