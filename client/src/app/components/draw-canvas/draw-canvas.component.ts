import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { DEFAULT_DRAW_CLIENT, DEFAULT_PENCIL, DEFAULT_POSITION_MOUSE_CLIENT, SIZE } from '@app/constants/canvas';
import { Canvas } from '@app/enums/canvas';
import { CanvasType } from '@app/enums/canvas-type';
import { CanvasState } from '@app/interfaces/canvas-state';
import { Command } from '@app/interfaces/command';
import { Pencil } from '@app/interfaces/pencil';
import { Vec2 } from '@app/interfaces/vec2';
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

    // Having an index of -1 makes way more sens, because the default index is out of bound.
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    indexOfCommand: number = -1;
    commands: Command[] = [];
    coordDraw: Vec2 = DEFAULT_POSITION_MOUSE_CLIENT;
    isClick: boolean = DEFAULT_DRAW_CLIENT;
    pencil: Pencil = DEFAULT_PENCIL;
    currentCommand: Command = { name: '', stroke: { lines: [] }, style: { color: '', width: 0, cap: 'round', destination: 'source-over' } };

    constructor(private toolBoxService: ToolBoxService, private drawService: DrawService, private canvasStateService: CanvasStateService) {}

    get width() {
        return SIZE.x;
    }

    get height() {
        return SIZE.y;
    }

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (!event.ctrlKey) {
            return;
        }
        if (event.key !== 'z' && event.key !== 'Z') {
            return;
        }
        if (event.shiftKey) {
            this.handleCtrlShiftZ();
        } else {
            this.handleCtrlZ();
        }
    }

    handleCtrlShiftZ() {
        if (this.indexOfCommand >= this.commands.length - 1) {
            return;
        }
        this.indexOfCommand++;
        this.executeCommands();
    }

    handleCtrlZ() {
        // same justification as before
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (this.indexOfCommand <= -1) {
            return;
        }
        this.indexOfCommand--;
        this.executeCommands();
    }

    executeCommands() {
        this.clearForeground(this.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D);

        for (let i = 0; i < this.indexOfCommand + 1; i++) {
            const command = this.commands[i];
            if (command.name === 'draw' || command.name === 'erase') {
                command.stroke.lines.forEach((line) => {
                    this.drawService.createStroke(line, command.style);
                });
            }
            if (command.name === 'clearForeground') {
                this.clearForeground(this.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D);
            }
        }
        this.drawService.updateImage();
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

    clearForeground(ctxCanvas: CanvasRenderingContext2D) {
        ctxCanvas.clearRect(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
        this.drawService.updateImage();
    }

    enterCanvas(event: MouseEvent) {
        this.drawService.enterCanvas(event);
        // return event.buttons === 0 ? this.stopDrawing() : this.startDrawing(event, true);
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
