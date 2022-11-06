import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogUploadFormComponent } from '@app/components/dialog-upload-form/dialog-upload-form.component';
import { PropagateCanvasEvent } from '@app/enums/propagate-canvas-event';
import { DrawService } from '@app/services/draw-service/draw-service.service';

@Component({
    selector: 'app-common-tool-box',
    templateUrl: './common-tool-box.component.html',
    styleUrls: ['./common-tool-box.component.scss'],
})
export class CommonToolBoxComponent {
    @Input() canvas: PropagateCanvasEvent;

    constructor(public dialog: MatDialog, public drawService: DrawService) {}

    openUploadDialog(): void {
        this.dialog.open(DialogUploadFormComponent, { data: { canvas: this.canvas } });
    }

    swapForegrounds(): void {
      console.log('swap foregrounds')
    }
}
