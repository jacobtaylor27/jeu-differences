import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import { DialogUploadFormComponent } from '@app/components/dialog-upload-form/dialog-upload-form.component';
import { DEFAULT_PENCIL } from '@app/constants/canvas';
import { CanvasType } from '@app/enums/canvas-type';
import { Tool } from '@app/enums/tool';
import { Pencil } from '@app/interfaces/pencil';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

@Component({
    selector: 'app-common-tool-box',
    templateUrl: './common-tool-box.component.html',
    styleUrls: ['./common-tool-box.component.scss'],
})
export class CommonToolBoxComponent implements OnInit {
    @Input() canvasType: CanvasType;
    pencil: Pencil = DEFAULT_PENCIL;
    tool: typeof Tool = Tool;
    colorButton: { pencil: string; eraser: string } = { pencil: 'background', eraser: 'primary' };

    constructor(public dialog: MatDialog, public toolService: ToolBoxService, public drawService: DrawService) {
        this.changeButtonColor(Tool.Pencil);
    }

    ngOnInit(): void {
        this.toolService.addCanvasType(this.canvasType);
    }

    changePencilState(tool: Tool): void {
        this.changeButtonColor(tool);
        this.pencil.state = tool;
        this.toolService.$pencil.get(this.canvasType)?.next(this.pencil);
    }

    formatLabel(value: number | null) {
        if (value === null) {
            return 0;
        }
        return value.toString() + 'px';
    }

    changePencilColor(color: string): void {
        this.pencil.color = color;
        this.toolService.$pencil.get(this.canvasType)?.next(this.pencil);
    }

    changePencilWidth(event: MatSliderChange): void {
        if (!event.value) {
            return;
        }
        this.pencil.width =
            this.pencil.state === Tool.Pencil
                ? { pencil: event.value, eraser: this.pencil.width.eraser }
                : { pencil: this.pencil.width.pencil, eraser: event.value };
        this.toolService.$pencil.get(this.canvasType)?.next(this.pencil);
    }

    changeButtonColor(tool: Tool) {
        this.colorButton = tool === Tool.Eraser ? { pencil: 'primary', eraser: 'accent' } : { pencil: 'accent', eraser: 'primary' };
    }

    openUploadDialog(): void {
        this.dialog.open(DialogUploadFormComponent, { data: { canvas: this.canvasType } });
    }
}
