import { Injectable } from '@angular/core';
import { ClearForegroundCommand } from '@app/classes/commands/clear-foreground-command';
import { DrawCommand } from '@app/classes/commands/draw-command';
import { PasteExternalForegroundOnCommand } from '@app/classes/commands/paste-external-foreground-on-command';
import { SwitchForegroundCommand } from '@app/classes/commands/switch-foreground-command';
import { DEFAULT_DRAW_CLIENT, DEFAULT_PENCIL, DEFAULT_POSITION_MOUSE_CLIENT, SIZE } from '@app/constants/canvas';
import { Canvas } from '@app/enums/canvas';
import { CanvasType } from '@app/enums/canvas-type';
import { Tool } from '@app/enums/tool';
import { CanvasState } from '@app/interfaces/canvas-state';
import { Command } from '@app/interfaces/command';
import { DrawingCommand } from '@app/interfaces/drawing-command';
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
    strokeIndex: number = 0;
    commands: DrawingCommand[] = [];
    drawingCommands: DrawingCommand[] = [];
    currentCommand: Command = {
        canvasType: CanvasType.None,
        name: '',
        strokes: [{ lines: [] }],
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
        this.setcurrentCommand('', focusedCanvas.canvasType);
    }

    draw(event: MouseEvent) {
        if (!this.isClick || !this.pencil) {
            return;
        }
        const line = this.updateMouseCoordinates(event);
        this.currentCommand.strokes[0].lines.push(line);

        this.currentCommand.style = {
            color: this.pencil.color,
            cap: this.pencil.cap,
            width: this.pencil.state === Tool.Pencil ? this.pencil.width.pencil : this.pencil.width.eraser,
            destination: this.pencil.state === Tool.Pencil ? 'source-over' : 'destination-out',
        };
        this.createStroke(line, this.currentCommand.style);
        this.updateImages();
    }

    redraw(command: Command) {
        command.strokes.forEach((stroke) => {
            stroke.lines.forEach((line) => {
                this.createStroke(line, command.style, command.canvasType);
            });
        });
    }

    stopDrawing() {
        this.isClick = false;
        if (this.pencil.state === 'Pencil') {
            this.currentCommand.name = 'draw';
        } else {
            this.currentCommand.name = 'erase';
        }
        this.addCurrentCommand(new DrawCommand(this.currentCommand, this));
        this.removeCommandsPastIndex();
    }

    leaveCanvas(event: MouseEvent) {
        if (event.buttons === 1) this.stopDrawing();
    }

    enterCanvas(event: MouseEvent) {
        if (event.buttons === 1) {
            this.startDrawing(event);
        }
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
            this.clearAllBackground();
            return;
        }
        const canvasState = this.canvasStateService.getCanvasState(canvasType);
        if (canvasState) {
            const background = canvasState.background.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            this.clearBackground(background);
        }
        this.updateImages();
    }

    clearAllBackground() {
        this.canvasStateService.states.forEach((state) => {
            const background = state.background.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            this.clearBackground(background);
        });
        this.updateImages();
    }

    clearAllForegrounds() {
        this.canvasStateService.states.forEach((state) => {
            const foreground = state.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            this.clearForeground(foreground);
        });
        this.updateImages();
    }

    clearForeground(ctxCanvas: CanvasRenderingContext2D) {
        ctxCanvas.clearRect(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
        this.updateImages();
    }

    resetForeground(canvasType: CanvasType) {
        this.setcurrentCommand('clearForeground', canvasType);
        const canvasState = this.canvasStateService.getCanvasState(canvasType);
        if (canvasState) {
            const foreground = canvasState.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            this.addCurrentCommand(new ClearForegroundCommand(this.currentCommand, foreground, this));
        }
        this.updateImages();
    }

    isEraser(pencilState: Tool) {
        return pencilState === Tool.Eraser;
    }

    updateImages() {
        const settings: CanvasRenderingContext2DSettings = { willReadFrequently: true };
        this.canvasStateService.states.forEach((state) => {
            const ctx: CanvasRenderingContext2D = state?.temporary.nativeElement.getContext('2d', settings) as CanvasRenderingContext2D;
            ctx.drawImage(state.background.nativeElement, 0, 0);
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(state.foreground.nativeElement, 0, 0);
            this.$drawingImage.get(state.canvasType)?.next(ctx.getImageData(0, 0, Canvas.WIDTH, Canvas.HEIGHT));
        });
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
        this.setcurrentCommand('switchForegrounds', CanvasType.Both);
        const leftCanvas = this.canvasStateService.getCanvasState(CanvasType.Left);
        const rightCanvas = this.canvasStateService.getCanvasState(CanvasType.Right);

        if (leftCanvas && rightCanvas) {
            this.addCurrentCommand(new SwitchForegroundCommand(this.currentCommand, leftCanvas, rightCanvas, this));
        }
    }

    switchForegroundImageData(primaryCanvasState: CanvasState, secondCanvasState: CanvasState) {
        const primaryForeground = primaryCanvasState.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const secondForeground = secondCanvasState.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const leftImageData = primaryForeground.getImageData(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
        const rightImageData = secondForeground.getImageData(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
        primaryForeground.putImageData(rightImageData, 0, 0);
        secondForeground.putImageData(leftImageData, 0, 0);
    }

    pasteExternalForegroundOn(canvasType: CanvasType) {
        this.setcurrentCommand('pasteExternalForegroundOn', canvasType);

        const leftCanvas = this.canvasStateService.getCanvasState(CanvasType.Left);
        const rightCanvas = this.canvasStateService.getCanvasState(CanvasType.Right);

        if (leftCanvas && rightCanvas) {
            if (canvasType === CanvasType.Left) {
                this.addCurrentCommand(new PasteExternalForegroundOnCommand(this.currentCommand, leftCanvas, rightCanvas, this));
            }
            if (canvasType === CanvasType.Right) {
                this.addCurrentCommand(new PasteExternalForegroundOnCommand(this.currentCommand, rightCanvas, leftCanvas, this));
            }
        }
    }

    pasteImageDataOn(targetedForeground: CanvasState, selectedForeground: CanvasState) {
        const targetForeground = targetedForeground.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const selectForeground = selectedForeground.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const selectedImageData = selectForeground.getImageData(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
        targetForeground.putImageData(selectedImageData, 0, 0);
    }

    clearAllLayers(canvasType: CanvasType) {
        if (canvasType === CanvasType.None || canvasType === CanvasType.Both) return;
        const canvasState = this.canvasStateService.getCanvasState(canvasType);

        if (canvasState) {
            const background = canvasState.background.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            const foreground = canvasState.background.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            this.clearBackground(background);
            this.clearForeground(foreground);
        }
        this.updateImages();
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

    private executeAllCommand() {
        this.clearAllForegrounds();
        for (let i = 0; i < this.indexOfCommand + 1; i++) {
            this.commands[i].execute();
        }
    }

    private addCurrentCommand(drawingCommand: DrawingCommand) {
        this.indexOfCommand++;
        this.commands[this.indexOfCommand] = drawingCommand;
        drawingCommand.execute();
    }

    private setcurrentCommand(name: string, canvasType: CanvasType) {
        this.currentCommand = {
            canvasType,
            name,
            strokes: [{ lines: [] }],
            style: { color: '', width: 0, cap: 'round', destination: 'source-over' },
        };
    }

    private removeCommandsPastIndex() {
        const commandsToDelete: number = this.commands.length - 1 - this.indexOfCommand;
        if (commandsToDelete > 0) {
            for (let i = 0; i < commandsToDelete; i++) {
                this.commands.pop();
            }
        }
    }
}
