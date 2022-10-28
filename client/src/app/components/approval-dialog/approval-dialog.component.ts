import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-approval-dialog',
    templateUrl: './approval-dialog.component.html',
    styleUrls: ['./approval-dialog.component.scss'],
})
export class ApprovalDialogComponent {
    @Input() opponentsName: string = 'John Doe';
    favoriteTheme: string = 'deeppurple-amber-theme';

    onClickApprove() {
        console.log('Approve');
    }

    onClickReject() {
        console.log('Reject');
    }
}
