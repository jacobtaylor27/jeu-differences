import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApprovalDialogComponent } from '@app/components/approval-dialog/approval-dialog.component';
import { RejectedDialogComponent } from '@app/components/rejected-dialog/rejected-dialog.component';
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

    // eslint-disable-next-line max-params -- absolutely need all the imported services
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
            this.dialog.open(ApprovalDialogComponent, { disableClose: true, data: { opponentsName: player.name, opponentsRoomId: player.id } });
        });

        this.socketService.once(SocketEvent.RejectPlayer, (reason: string) => {
            this.dialog.closeAll();
            this.dialog.open(RejectedDialogComponent, { data: { reason } });
            this.routerService.navigateTo('select');
        });

        this.socketService.once(SocketEvent.JoinGame, (data: { roomId: string; playerName: string }) => {
            this.gameInformationHandlerService.setPlayerName(data.playerName);

            this.socketService.send(SocketEvent.JoinGame, { player: this.gameInformationHandlerService.getPlayer().name, room: data.roomId });
            this.gameInformationHandlerService.roomId = data.roomId;

            this.socketService.on(SocketEvent.Play, (id: string) => {
                this.gameInformationHandlerService.roomId = id;
                this.routerService.navigateTo('game');
            });
        });
    }

    ngOnDestroy() {
        this.socketService.off(SocketEvent.RequestToJoin);
        this.socketService.off(SocketEvent.RejectPlayer);
    }
}
