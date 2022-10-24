import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExitButtonHandlerService } from '@app/services/exit-button-handler/exit-button-handler.service';
@Component({
    selector: 'app-exit-game-button',
    templateUrl: './exit-game-button.component.html',
    styleUrls: ['./exit-game-button.component.scss'],
})
export class ExitGameButtonComponent {
    @ViewChild('exitDialogContent')
    private readonly exitDialogContentRef: TemplateRef<HTMLElement>;
    constructor(readonly matDialog: MatDialog, readonly exitButtonService: ExitButtonHandlerService) {}

    onExit(): void {
        this.matDialog.open(this.exitDialogContentRef);
    }
}
