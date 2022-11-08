import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Theme } from '@app/enums/theme';

@Component({
    selector: 'app-dialog-game-over',
    templateUrl: './dialog-game-over.component.html',
    styleUrls: ['./dialog-game-over.component.scss'],
})
export class DialogGameOverComponent {
    isWin: boolean;
    winner: string;
    theme = Theme.ClassName;
    constructor(@Inject(MAT_DIALOG_DATA) public data: { win: boolean; winner: string }) {
        this.isWin = data.win;
        this.winner = data.winner;
    }
}
