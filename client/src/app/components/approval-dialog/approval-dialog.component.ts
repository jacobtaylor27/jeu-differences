import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
        },
    ){
        this.opponentsName = data.opponentsName}

    onClickApprove() {
        // eslint-disable-next-line no-console
        console.log('Approve');
    }

    onClickReject() {
        // eslint-disable-next-line no-console
        console.log('Reject');
    }
}
