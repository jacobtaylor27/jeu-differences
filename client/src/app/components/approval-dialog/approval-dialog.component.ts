import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { RouterService } from '@app/services/router-service/router.service';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-approval-dialog',
    templateUrl: './approval-dialog.component.html',
    styleUrls: ['./approval-dialog.component.scss'],
})
export class ApprovalDialogComponent {
    @Input() opponentsName: string;
    favoriteTheme: string = 'deeppurple-amber-theme';

    // eslint-disable-next-line max-params
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: {
            opponentsName: string;
            opponentsRoomId: string;
        },
        public socketService: CommunicationSocketService,
        private readonly gameInformationHandlerService: GameInformationHandlerService,
        private readonly routerService: RouterService,
    ) {
        this.opponentsName = data.opponentsName;
    }

    onClickApprove() {
        this.gameInformationHandlerService.setPlayerName(this.opponentsName);
        this.socketService.send(SocketEvent.AcceptPlayer, {
            gameId: this.gameInformationHandlerService.roomId,
            opponentsRoomId: this.data.opponentsRoomId,
            playerName: this.gameInformationHandlerService.getPlayer().name,
        });
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.socketService.on(SocketEvent.Play, () => {
            this.routerService.navigateTo('game');
        });
    }

    onClickReject() {
        this.gameInformationHandlerService.isReadyToAccept = true;
        this.socketService.send(SocketEvent.RejectPlayer, {
            roomId: this.gameInformationHandlerService.roomId,
            opponentsRoomId: this.data.opponentsRoomId,
        });
    }
}
