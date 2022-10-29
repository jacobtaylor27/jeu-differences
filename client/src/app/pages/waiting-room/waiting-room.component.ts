import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApprovalDialogComponent } from '@app/components/approval-dialog/approval-dialog.component';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { ExitButtonHandlerService } from '@app/services/exit-button-handler/exit-button-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-waiting-room',
    templateUrl: './waiting-room.component.html',
    styleUrls: ['./waiting-room.component.scss'],
})
export class WaitingRoomComponent implements OnInit {
    favoriteTheme: string = 'deeppurple-amber-theme';

    // eslint-disable-next-line max-params
    constructor(
        private exitButton: ExitButtonHandlerService,
        private socketService: CommunicationSocketService,
        public dialog: MatDialog,
        private readonly gameInformationHandlerService: GameInformationHandlerService,
    ) {
        this.exitButton.setWaitingRoom();
    }

    ngOnInit(): void {
        this.socketService.on(SocketEvent.RequestToJoin, (playerName: string) => {
            this.dialog.open(ApprovalDialogComponent, { data: { opponentsName: playerName } });
        });

        this.socketService.on(SocketEvent.JoinGame, (gameId: string) => {
            this.socketService.send(SocketEvent.JoinGame, { player: this.gameInformationHandlerService.getPlayerName(), gameId });
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            this.socketService.on(SocketEvent.Play, () => {});
        });
    }
}
