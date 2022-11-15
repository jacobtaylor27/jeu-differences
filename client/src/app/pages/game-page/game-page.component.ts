import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogGameOverComponent } from '@app/components/dialog-game-over/dialog-game-over.component';
import { Theme } from '@app/enums/theme';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { ExitButtonHandlerService } from '@app/services/exit-button-handler/exit-button-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { GameMode } from '@common/game-mode';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnDestroy {
    favoriteTheme: string = Theme.ClassName;
    title: string;
    clock: string;

    // eslint-disable-next-line max-params -- absolutely need all the imported services
    constructor(
        private dialog: MatDialog,
        public gameInfoHandlerService: GameInformationHandlerService,
        exitButtonService: ExitButtonHandlerService,
        private socket: CommunicationSocketService,
    ) {
        exitButtonService.setGamePage();
        this.title = 'Mode ' + this.gameInfoHandlerService.gameMode + ' ' + (this.gameInfoHandlerService.isMulti ? 'Multijoueur' : 'Solo');
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
        if (this.gameInfoHandlerService.gameMode === GameMode.Classic) {
            dialogConfig.data = {
                win: isWin,
                winner: isWin ? this.gameInfoHandlerService.getPlayer().name : this.gameInfoHandlerService.getOpponent().name,
                isClassic: true,
            };
        } else {
            dialogConfig.data = {
                win: isWin,
                winner: undefined,
                isClassic: false,
            };
        }
        this.dialog.open(DialogGameOverComponent, dialogConfig);
    }

    ngOnDestroy(): void {
        this.socket.send(SocketEvent.LeaveGame, { gameId: this.gameInfoHandlerService.roomId });
        this.socket.off(SocketEvent.Win);
        this.socket.off(SocketEvent.Lose);
    }
}
