import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Theme } from '@app/enums/theme';

@Component({
    selector: 'app-player-left-snackbar',
    templateUrl: './player-left-snackbar.component.html',
    styleUrls: ['./player-left-snackbar.component.scss'],
})
export class PlayerLeftSnackbarComponent {
    theme: typeof Theme = Theme;
    constructor(public snackBarRef: MatSnackBarRef<PlayerLeftSnackbarComponent>, @Inject(MAT_SNACK_BAR_DATA) public data: unknown) {}
}
