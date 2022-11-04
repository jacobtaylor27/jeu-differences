import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApprovalDialogComponent } from '@app/components/approval-dialog/approval-dialog.component';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { ExitButtonHandlerService } from '@app/services/exit-button-handler/exit-button-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { RouterService } from '@app/services/router-service/router.service';
import { SocketEvent } from '@common/socket-event';
import { User } from '@common/user';
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
        public socketService: CommunicationSocketService,
        public dialog: MatDialog,
        private readonly routerService: RouterService,
        private readonly gameInformationHandlerService: GameInformationHandlerService,
    ) {
        this.exitButton.setWaitingRoom();
    }

    ngOnInit(): void {
        this.socketService.on(SocketEvent.RequestToJoin, (player: User) => {
            this.dialog.open(ApprovalDialogComponent, { data: { opponentsName: player.name, opponentsRoomId: player.id } });
        });

        this.socketService.on(SocketEvent.RejectPlayer, () => {
            // add a error message;
            this.routerService.navigateTo('select');
        });

        this.socketService.on(SocketEvent.JoinGame, (roomId: string) => {
            this.socketService.send(SocketEvent.JoinGame, { player: this.gameInformationHandlerService.getPlayerName(), roomId });
            this.gameInformationHandlerService.roomId = roomId;
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            this.socketService.on(SocketEvent.Play, () => {
                this.routerService.navigateTo('game');
            });
        });
    }
}
