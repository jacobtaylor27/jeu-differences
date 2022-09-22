import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-exit-game-button',
    templateUrl: './exit-game-button.component.html',
    styleUrls: ['./exit-game-button.component.scss'],
})
export class ExitGameButtonComponent {
    @ViewChild('exitDialogContent')
    private readonly exitDialogContentRef: TemplateRef<HTMLElement>;
    constructor(readonly matDialog: MatDialog) {}

    onExit(): void {
        this.matDialog.open(this.exitDialogContentRef);
    }
}
