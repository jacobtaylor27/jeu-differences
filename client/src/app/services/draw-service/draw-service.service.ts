import { Injectable } from '@angular/core';
import { DEFAULT_DRAW_CLIENT, DEFAULT_PENCIL, DEFAULT_POSITION_MOUSE_CLIENT, SIZE } from '@app/constants/canvas';
import { Canvas } from '@app/enums/canvas';
import { CanvasType } from '@app/enums/canvas-type';
import { Tool } from '@app/enums/tool';
import { Command } from '@app/interfaces/command';
import { Line } from '@app/interfaces/line';
import { Pencil } from '@app/interfaces/pencil';
import { StrokeStyle } from '@app/interfaces/stroke-style';
import { Vec2 } from '@app/interfaces/vec2';
import { CanvasStateService } from '@app/services/canvas-state/canvas-state.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawService {
    $drawingImage: Map<CanvasType, Subject<ImageData>>;

    // Having an index of -1 makes way more sens, because the default index is out of bound.
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    indexOfCommand: number = -1;
    commands: Command[] = [];
    currentCommand: Command = {
        canvasType: CanvasType.None,
        name: '',
        stroke: { lines: [] },
        style: { color: '', width: 0, cap: 'round', destination: 'source-over' },
    };

    coordDraw: Vec2 = DEFAULT_POSITION_MOUSE_CLIENT;
    isClick: boolean = DEFAULT_DRAW_CLIENT;
    pencil: Pencil = DEFAULT_PENCIL;

    constructor(private canvasStateService: CanvasStateService) {
        this.$drawingImage = new Map();
    }

    startDrawing(event: MouseEvent) {
        this.isClick = true;
        const focusedCanvas = this.canvasStateService.getFocusedCanvas();
        if (focusedCanvas === undefined) return;

        this.coordDraw = this.reposition(focusedCanvas.foreground?.nativeElement, event);
        this.currentCommand = {
            canvasType: focusedCanvas.canvasType,
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
        this.removeCommandsPastIndex();
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

    resetAllForegrounds() {
        this.canvasStateService.states.forEach((state) => {
            const foreground = state.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            this.clearForeground(foreground);
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

    createStroke(line: Line, strokeStyle: StrokeStyle, canvasType?: CanvasType) {
        const focusedCanvas = canvasType ? this.canvasStateService.getCanvasState(canvasType) : this.canvasStateService.getFocusedCanvas();
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

    redo() {
        if (this.indexOfCommand >= this.commands.length - 1) {
            return;
        }
        this.indexOfCommand++;
        this.executeAllCommand();
    }

    undo() {
        // same justification as before
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (this.indexOfCommand <= -1) {
            return;
        }
        this.indexOfCommand--;
        this.executeAllCommand();
    }

    executeAllCommand() {
        this.resetAllForegrounds();

        for (let i = 0; i < this.indexOfCommand + 1; i++) {
            const command: Command = this.commands[i];
            if (command.name === 'draw') {
                this.redraw(command);
            } else if (command.name === 'erase') {
                this.redraw(command);
            } else {
                console.log('command indéterminée');
            }
        }
    }

    private removeCommandsPastIndex() {
        const commandsToDelete: number = this.commands.length - 1 - this.indexOfCommand;
        if (commandsToDelete > 0) {
            for (let i = 0; i < commandsToDelete; i++) {
                this.commands.pop();
            }
        }
    }

    private redraw(command: Command) {
        command.stroke.lines.forEach((line) => {
            this.createStroke(line, command.style, command.canvasType);
        });
    }
}
