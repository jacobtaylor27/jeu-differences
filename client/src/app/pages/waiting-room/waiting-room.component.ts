import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class WaitingRoomComponent implements OnInit, OnDestroy {
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

        this.socketService.on(SocketEvent.JoinGame, (data: { roomId: string; playerName: string }) => {
            this.gameInformationHandlerService.setPlayerName(data.playerName);

            this.socketService.send(SocketEvent.JoinGame, { player: this.gameInformationHandlerService.getPlayer().name, room: data.roomId });
            this.gameInformationHandlerService.roomId = data.roomId;
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            this.socketService.on(SocketEvent.Play, (id: string) => {
                this.gameInformationHandlerService.roomId = id;
                this.routerService.navigateTo('game');
            });
        });
    }

    ngOnDestroy() {
        this.socketService.off(SocketEvent.RequestToJoin);
    }
}
