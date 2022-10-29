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
            opponentsName : string
        }, private socketService : CommunicationSocketService, private readonly gameInformationHandlerService: GameInformationHandlerService
    ){

        this.opponentsName = data.opponentsName}

    onClickApprove() {
        // eslint-disable-next-line no-console
        this.socketService.send(SocketEvent.AcceptPlayer, {gameId : this.gameInformationHandlerService.gameId})
        this.socketService.on(SocketEvent.Play, () => {})
    }

    onClickReject() {
        // eslint-disable-next-line no-console
        console.log('Reject');
    }
}
