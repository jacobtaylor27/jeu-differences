import { Injectable } from '@angular/core';
import { DEFAULT_DRAW_CLIENT, DEFAULT_PENCIL, DEFAULT_POSITION_MOUSE_CLIENT, SIZE } from '@app/constants/canvas';
import { Canvas } from '@app/enums/canvas';
import { CanvasType } from '@app/enums/canvas-type';
import { Tool } from '@app/enums/tool';
import { Line } from '@app/interfaces/line';
import { Pencil } from '@app/interfaces/pencil';
import { StrokeStyle } from '@app/interfaces/stroke-style';
import { Vec2 } from '@app/interfaces/vec2';
import { CanvasStateService } from '@app/services/canvas-state/canvas-state.service';
import { CommandService } from '@app/services/command-service/command.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawService {
    $drawingImage: Map<CanvasType, Subject<ImageData>>;

    coordDraw: Vec2 = DEFAULT_POSITION_MOUSE_CLIENT;
    isClick: boolean = DEFAULT_DRAW_CLIENT;
    pencil: Pencil = DEFAULT_PENCIL;

    constructor(private canvasStateService: CanvasStateService, private commandService: CommandService) {
        this.$drawingImage = new Map();
    }

    startDrawing(event: MouseEvent) {
        this.isClick = true;
        const focusedCanvas = this.canvasStateService.getFocusedCanvas();
        if (focusedCanvas) {
            this.coordDraw = this.reposition(focusedCanvas.foreground?.nativeElement, event);
        }
        this.commandService.currentCommand = {
            name: '',
            stroke: { lines: [] },
            style: { color: '', width: 0, cap: 'round', destination: 'source-over' },
        };
    }

    draw(event: MouseEvent) {
        if (!this.isClick || !this.pencil) {
            return;
        }
        const line = this.updateMouseCoordinates(event);
        this.commandService.currentCommand.stroke.lines.push(line);

        this.commandService.currentCommand.style = {
            color: this.pencil.color,
            cap: this.pencil.cap,
            width: this.pencil.state === Tool.Pencil ? this.pencil.width.pencil : this.pencil.width.eraser,
            destination: this.pencil.state === Tool.Pencil ? 'source-over' : 'destination-out',
        };
        this.createStroke(line, this.commandService.currentCommand.style);
        this.updateImage();
    }

    stopDrawing() {
        this.isClick = false;
        this.commandService.indexOfCommand++;
        if (this.pencil.state === 'Pencil') {
            this.commandService.currentCommand.name = 'draw';
        } else {
            this.commandService.currentCommand.name = 'erase';
        }
        this.commandService.commands[this.commandService.indexOfCommand] = this.commandService.currentCommand;
    }

    leaveCanvas(event: MouseEvent) {}

    enterCanvas(event: MouseEvent) {
        // return event.buttons === 0 ? this.stopDrawing() : this.startDrawing(event, true);
    }

    addDrawingCanvas(canvasType: CanvasType) {
        this.$drawingImage.set(canvasType, new Subject<ImageData>());
    }

    clearBackground(ctxImage: CanvasRenderingContext2D) {
        ctxImage.rect(0, 0, SIZE.x, SIZE.y);
        ctxImage.fillStyle = 'white';
        ctxImage.fill();
    }

    resetBackground(canvasType: CanvasType) {
        if (canvasType === CanvasType.Both) {
            this.resetAllBackground();
            return;
        }
        const canvasState = this.canvasStateService.getCanvasState(canvasType);
        if (canvasState) {
            const background = canvasState.background.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            this.clearBackground(background);
        }
    }

    resetAllBackground() {
        this.canvasStateService.states.forEach((state) => {
            const background = state.background.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            this.clearBackground(background);
        });
    }

    clearForeground(ctxCanvas: CanvasRenderingContext2D) {
        ctxCanvas.clearRect(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
        this.updateImage();
    }

    resetForeground(canvasType: CanvasType) {
        const canvasState = this.canvasStateService.getCanvasState(canvasType);
        if (canvasState) {
            const foreground = canvasState.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            this.clearForeground(foreground);
        }
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

    switchForegrounds() {
        const leftCanvas = this.canvasStateService.getCanvasState(CanvasType.Left);
        const rightCanvas = this.canvasStateService.getCanvasState(CanvasType.Right);

        if (leftCanvas && rightCanvas) {
            const leftForegroundContext = leftCanvas.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            const rightForegroundContext = rightCanvas.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            const temp = leftCanvas.foreground;
            this.resetForeground(CanvasType.Right);
            this.resetForeground(CanvasType.Left);

            leftForegroundContext.drawImage(rightCanvas.foreground.nativeElement, 0, 0);
            rightForegroundContext.drawImage(temp.nativeElement, 0, 0);
        }
    }

    resetAllLayers(canvasType: CanvasType) {
        this.resetBackground(canvasType);
        this.resetForeground(canvasType);
    }

    copyForeground(canvasType: CanvasType) {}
}
