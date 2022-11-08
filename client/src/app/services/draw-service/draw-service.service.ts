import { Injectable } from '@angular/core';
import { DEFAULT_DRAW_CLIENT, DEFAULT_PENCIL, DEFAULT_POSITION_MOUSE_CLIENT } from '@app/constants/canvas';
import { CanvasType } from '@app/enums/canvas-type';
import { Tool } from '@app/enums/tool';
import { Command } from '@app/interfaces/command';
import { Line } from '@app/interfaces/line';
import { Pencil } from '@app/interfaces/pencil';
import { StrokeStyle } from '@app/interfaces/stroke-style';
import { Vec2 } from '@app/interfaces/vec2';
import { CanvasStateService } from '@app/services/canvas-state/canvas-state.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawService {
    $drawingImage: Map<CanvasType, Subject<ImageData>>;
    foregroundContext: Map<CanvasType, HTMLCanvasElement>;

    // Having an index of -1 makes way more sens, because the default index is out of bound.
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    indexOfCommand: number = -1;
    commands: Command[] = [];
    coordDraw: Vec2 = DEFAULT_POSITION_MOUSE_CLIENT;
    isClick: boolean = DEFAULT_DRAW_CLIENT;
    pencil: Pencil = DEFAULT_PENCIL;
    currentCommand: Command = { name: '', stroke: { lines: [] }, style: { color: '', width: 0, cap: 'round', destination: 'source-over' } };

    constructor(private toolService: ToolBoxService, private canvasStateService: CanvasStateService) {
        this.$drawingImage = new Map();
        this.foregroundContext = new Map();
    }

    startDrawing(event: MouseEvent) {
        this.isClick = true;
        const focusedCanvas = this.canvasStateService.getFocusedCanvas();
        if (focusedCanvas) {
            this.coordDraw = this.reposition(focusedCanvas.foreground?.nativeElement, event);
        }
        this.currentCommand = { name: '', stroke: { lines: [] }, style: { color: '', width: 0, cap: 'round', destination: 'source-over' } };
    }

    draw(event: MouseEvent) {
        if (!this.isClick || !this.pencil) {
            return;
        }
        const line = this.updateMouseCoordinates(event);
        this.currentCommand.stroke.lines.push(line);

        this.currentCommand.style = {
            color: this.pencil.color,
            cap: this.pencil.cap,
            width: this.pencil.state === Tool.Pencil ? this.pencil.width.pencil : this.pencil.width.eraser,
            destination: this.pencil.state === Tool.Pencil ? 'source-over' : 'destination-out',
        };
        this.createStroke(line, this.currentCommand.style);
        this.updateImage();
    }

    stopDrawing() {
        this.isClick = false;
        this.indexOfCommand++;
        if (this.pencil.state === 'Pencil') {
            this.currentCommand.name = 'draw';
        } else {
            this.currentCommand.name = 'erase';
        }
        this.commands[this.indexOfCommand] = this.currentCommand;
    }

    leaveCanvas() {}

    enterCanvas(event: MouseEvent) {}

    addDrawingCanvas(canvasType: CanvasType) {
        this.$drawingImage.set(canvasType, new Subject<ImageData>());
    }

    resetBackground(canvasType: CanvasType) {
        if (canvasType === CanvasType.Both) {
            this.toolService.$resetBackground.forEach((event: Subject<void>) => {
                event.next();
            });
            return;
        }
        this.toolService.$resetBackground.get(canvasType)?.next();
    }

    resetForeground(canvasType: CanvasType) {
        if (canvasType === CanvasType.Both) {
            this.toolService.$resetForeground.forEach((event: Subject<void>) => {
                event.next();
            });
            return;
        }
        this.toolService.$resetForeground.get(canvasType)?.next();
    }

    isEraser(pencilState: Tool) {
        return pencilState === Tool.Eraser;
    }

    updateImage() {
        const settings: CanvasRenderingContext2DSettings = { willReadFrequently: true };
        const focusedCanvas = this.canvasStateService.getFocusedCanvas();
        const ctx: CanvasRenderingContext2D = focusedCanvas?.temporary.nativeElement.getContext('2d', settings) as CanvasRenderingContext2D;
        if (focusedCanvas) {
            ctx.drawImage(focusedCanvas.background.nativeElement, 0, 0);
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(focusedCanvas.foreground.nativeElement, 0, 0);
        }
    }

    createStroke(line: Line, strokeStyle: StrokeStyle) {
        const focusedCanvas = this.canvasStateService.getFocusedCanvas();
        const ctx: CanvasRenderingContext2D = focusedCanvas?.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        ctx.beginPath();
        ctx.globalCompositeOperation = strokeStyle.destination;
        ctx.lineWidth = strokeStyle.width;
        ctx.lineCap = strokeStyle.cap;
        ctx.strokeStyle = strokeStyle.color;
        ctx.moveTo(line.initCoord.x, line.initCoord.y);
        ctx.lineTo(line.finalCoord.x, line.finalCoord.y);
        ctx.stroke();
    }

    reposition(canvas: HTMLCanvasElement, event: MouseEvent): Vec2 {
        return { x: event.clientX - canvas.offsetLeft, y: event.clientY - canvas.offsetTop };
    }

    updateMouseCoordinates(event: MouseEvent): Line {
        const initCoord: Vec2 = { x: this.coordDraw.x, y: this.coordDraw.y };
        const focusedCanvas = this.canvasStateService.getFocusedCanvas();
        if (focusedCanvas) {
            this.coordDraw = this.reposition(focusedCanvas.foreground?.nativeElement, event);
        }
        const finalCoord: Vec2 = { x: this.coordDraw.x, y: this.coordDraw.y };
        return { initCoord, finalCoord };
    }
}
