import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DEFAULT_PENCIL, SIZE } from '@app/constants/canvas';
import { CanvasType } from '@app/enums/canvas-type';
import { CanvasState } from '@app/interfaces/canvas-state';
import { Pencil } from '@app/interfaces/pencil';
import { CanvasStateService } from '@app/services/canvas-state/canvas-state.service';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

@Component({
    selector: 'app-draw-canvas',
    templateUrl: './draw-canvas.component.html',
    styleUrls: ['./draw-canvas.component.scss'],
})
export class DrawCanvasComponent implements AfterViewInit {
    @ViewChild('background', { static: false }) background!: ElementRef<HTMLCanvasElement>;
    @ViewChild('foreground', { static: false }) foreground!: ElementRef<HTMLCanvasElement>;
    @ViewChild('noContentCanvas', { static: false }) noContentCanvas!: ElementRef<HTMLCanvasElement>;
    @Input() canvasType: CanvasType;

    pencil: Pencil = DEFAULT_PENCIL;

    constructor(private toolBoxService: ToolBoxService, private drawService: DrawService, private canvasStateService: CanvasStateService) {}

    get width() {
        return SIZE.x;
    }

    get height() {
        return SIZE.y;
    }

    ngAfterViewInit() {
        const currentState: CanvasState = {
            canvasType: this.canvasType,
            foreground: this.foreground,
            background: this.background,
            temporary: this.noContentCanvas,
        };
        this.canvasStateService.states.push(currentState);

        this.toolBoxService.addCanvasType(this.canvasType);
        this.drawService.addDrawingCanvas(this.canvasType);
        this.toolBoxService.$pencil.get(this.canvasType)?.subscribe((newPencil: Pencil) => {
            this.pencil = newPencil;
        });

        const background = this.background.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.toolBoxService.$uploadImage.get(this.canvasType)?.subscribe(async (newImage: ImageBitmap) => {
            background.drawImage(newImage, 0, 0);
            this.drawService.updateImage();
        });

        this.toolBoxService.$pencil.get(this.canvasType)?.subscribe((newPencil: Pencil) => {
            this.pencil = newPencil;
        });

        this.drawService.resetAllLayers(this.canvasType);
    }

    enterCanvas(event: MouseEvent) {
        this.drawService.enterCanvas(event);
    }

    leaveCanvas(event: MouseEvent) {
        this.drawService.leaveCanvas(event);
    }

    startDrawing(event: MouseEvent) {
        this.canvasStateService.setFocusedCanvas(this.canvasType);
        this.drawService.startDrawing(event);
    }

    stopDrawing() {
        this.drawService.stopDrawing();
    }

    draw(event: MouseEvent) {
        this.drawService.draw(event);
    }
}
