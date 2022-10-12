import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import { DialogResetComponent } from '@app/components/dialog-reset/dialog-reset.component';
import { DialogUploadFormComponent } from '@app/components/dialog-upload-form/dialog-upload-form.component';
import { DEFAULT_PENCIL } from '@app/constants/canvas';
import { PropagateCanvasEvent } from '@app/enums/propagate-canvas-event';
import { Tool } from '@app/enums/tool';
import { Pencil } from '@app/interfaces/pencil';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

@Component({
    selector: 'app-tool-box',
    templateUrl: './tool-box.component.html',
    styleUrls: ['./tool-box.component.scss'],
})
export class ToolBoxComponent {
    @Input() canvas: PropagateCanvasEvent;
    pencil: Pencil = DEFAULT_PENCIL;
    tool: typeof Tool = Tool;
    canvasPosition: typeof PropagateCanvasEvent = PropagateCanvasEvent;

    constructor(public dialog: MatDialog, public toolService: ToolBoxService) {}

    changePencilState(tool: Tool): void {
        this.pencil.state = tool;
        this.toolService.$pencil.next(this.pencil);
    }

    formatLabel(value: number | null) {
        if (value === null) {
            return 0;
        }
        return value.toString() + 'px';
    }

    changePencilColor(color: string): void {
        this.pencil.color = color;
        this.toolService.$pencil.next(this.pencil);
    }

    changePencilWith(event: MatSliderChange): void {
        this.pencil.width = event.value !== null ? event.value : 0;
        this.toolService.$pencil.next(this.pencil);
    }

    openUploadDialog(): void {
        this.dialog.open(DialogUploadFormComponent, { data: { canvas: this.canvas } });
    }

    openResetDialog(): void {
        this.dialog.open(DialogResetComponent, { width: '750px' });
    }
}
