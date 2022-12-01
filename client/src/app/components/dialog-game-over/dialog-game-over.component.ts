import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Theme } from '@app/enums/theme';
import { GameRecord } from '@common/game-record';

@Component({
    selector: 'app-dialog-game-over',
    templateUrl: './dialog-game-over.component.html',
    styleUrls: ['./dialog-game-over.component.scss'],
})
export class DialogGameOverComponent {
    isWin: boolean;
    winner: string;
    nbPoints: string;
    isClassic: boolean;
    theme = Theme.ClassName;
    constructor(@Inject(MAT_DIALOG_DATA) public data: { win: boolean; winner: string; isClassic: boolean; nbPoints: string }) {
        this.isWin = data.win;
        this.winner = data.winner;
        this.isClassic = data.isClassic;
        this.nbPoints = data.nbPoints;
    }
}
