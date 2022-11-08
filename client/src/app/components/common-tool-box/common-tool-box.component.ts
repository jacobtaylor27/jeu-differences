import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogUploadFormComponent } from '@app/components/dialog-upload-form/dialog-upload-form.component';
import { CanvasType } from '@app/enums/canvas-type';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-common-tool-box',
    templateUrl: './common-tool-box.component.html',
    styleUrls: ['./common-tool-box.component.scss'],
})
export class CommonToolBoxComponent {
    @Input() canvasType: CanvasType;

    constructor(public dialog: MatDialog, public drawService: DrawService, private toolBoxService: ToolBoxService) {}

    openUploadDialog(): void {
        this.dialog.open(DialogUploadFormComponent, { data: { canvas: this.canvasType } });
    }

    swapForegrounds(): void {
        this.toolBoxService.$switchForeground.forEach((event: Subject<void>) => event.next());
    }
}
