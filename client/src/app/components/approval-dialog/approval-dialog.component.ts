import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-approval-dialog',
    templateUrl: './approval-dialog.component.html',
    styleUrls: ['./approval-dialog.component.scss'],
})
export class ApprovalDialogComponent {
    @Input() opponentsName: string;
    favoriteTheme: string = 'deeppurple-amber-theme';

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: {
            opponentsName: string;
            opponentsRoomId: string;
        },
        public socketService: CommunicationSocketService,
        private readonly gameInformationHandlerService: GameInformationHandlerService,
    ) {
        this.opponentsName = data.opponentsName;
    }

    onClickApprove() {
        this.socketService.send(SocketEvent.AcceptPlayer, {
            gameId: this.gameInformationHandlerService.roomId,
            opponentsRoomId: this.data.opponentsRoomId,
        });
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.socketService.on(SocketEvent.Play, () => {});
    }

    onClickReject() {
        this.gameInformationHandlerService.isReadyToAccept = true;
        this.socketService.send(SocketEvent.RejectPlayer, {
            roomId: this.gameInformationHandlerService.roomId,
            opponentsRoomId: this.data.opponentsRoomId,
        });
    }
}
