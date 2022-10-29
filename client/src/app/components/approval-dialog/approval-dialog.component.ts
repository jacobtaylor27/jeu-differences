import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
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
        }, private socketService : CommunicationSocketService,
    ){

        this.opponentsName = data.opponentsName}

    onClickApprove() {
        // eslint-disable-next-line no-console
        console.log('Approve');
        this.socketService.send(SocketEvent.AcceptPlayer)
    }

    onClickReject() {
        // eslint-disable-next-line no-console
        console.log('Reject');
    }
}
