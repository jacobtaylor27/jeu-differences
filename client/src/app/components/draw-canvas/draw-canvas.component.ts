import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DEFAULT_DRAW_CLIENT, DEFAULT_PENCIL, DEFAULT_POSITION_MOUSE_CLIENT, SIZE } from '@app/constants/canvas';
import { Canvas } from '@app/enums/canvas';
import { Pencil } from '@app/interfaces/pencil';
import { Vec2 } from '@app/interfaces/vec2';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

interface Stroke {
    lines: Line[];
    style: StrokeStyle;
}
interface StrokeStyle {
    color: string;
    width: number;
    cap: CanvasLineCap;
}
interface Line {
    initCoord: Vec2;
    finalCoord: Vec2;
}

interface Command {
    name: string;
    stroke: Stroke;
}

@Component({
    selector: 'app-draw-canvas',
    templateUrl: './draw-canvas.component.html',
    styleUrls: ['./draw-canvas.component.scss'],
})
export class DrawCanvasComponent implements AfterViewInit {
    @ViewChild('imageDifference', { static: false }) img!: ElementRef<HTMLCanvasElement>;
    @ViewChild('noContentCanvas', { static: false }) noContentCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('paint', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
    coordDraw: Vec2 = DEFAULT_POSITION_MOUSE_CLIENT;
    isClick: boolean = DEFAULT_DRAW_CLIENT;
    pencil: Pencil = DEFAULT_PENCIL;
    commands: Command[] = [];
    indexOfStroke: number = -1;
    currentCommand: Command = { name: '', stroke: { lines: [], style: { color: '', width: 0, cap: 'round' } } };
    execute = {
        draw: (line: Line, strokeStyle: StrokeStyle) => {
            const ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            ctx.beginPath();
            ctx.globalCompositeOperation = 'source-over';
            ctx.lineWidth = strokeStyle.width;
            ctx.lineCap = strokeStyle.cap;
            ctx.strokeStyle = strokeStyle.color;
            ctx.moveTo(line.initCoord.x, line.initCoord.y);
            ctx.lineTo(line.finalCoord.x, line.finalCoord.y);
            ctx.stroke();
            this.updateImage();
        },
        erase: (line: Line, strokeStyle: StrokeStyle) => {
            const ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.lineWidth = strokeStyle.width;
            ctx.lineCap = strokeStyle.cap;
            ctx.strokeStyle = strokeStyle.color;
            ctx.moveTo(line.initCoord.x, line.initCoord.y);
            ctx.lineTo(line.finalCoord.x, line.finalCoord.y);
            ctx.stroke();
            this.updateImage();
        },
    };

    constructor(private toolBoxService: ToolBoxService, private drawService: DrawService) {
        this.toolBoxService.$pencil.subscribe((newPencil: Pencil) => {
            this.pencil = newPencil;
        });
    }

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
        if (this.indexOfStroke >= this.commands.length - 1) {
            return;
        }
        this.indexOfStroke++;
        this.displayStrokes();
    }

    // Il y a un bug si la souris commence à l'intérieur du canvas.
    // this.commands va contenir un élément supplémentaire.
    handleCtrlZ() {
        if (this.indexOfStroke <= -1) {
            return;
        }
        this.indexOfStroke--;
        this.displayStrokes();
    }

    displayStrokes() {
        this.resetCanvas(this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D);
        console.log(this.indexOfStroke);
        for (let i = 0; i < this.indexOfStroke + 1; i++) {
            const command = this.commands[i];
            command.stroke.lines.forEach((line) => {
                this.execute.draw(line, command.stroke.style);
            });
        }
    }

    ngAfterViewInit() {
        this.toolBoxService.$uploadImageInDiff.subscribe(async (newImage: ImageBitmap) => {
            (this.img.nativeElement.getContext('2d') as CanvasRenderingContext2D).drawImage(newImage, 0, 0);
            this.updateImage();
        });
        this.toolBoxService.$resetDiff.subscribe(() =>
            this.resetCanvasAndImage(
                this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D,
                this.img.nativeElement.getContext('2d') as CanvasRenderingContext2D,
            ),
        );
        this.resetCanvasAndImage(
            this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D,
            this.img.nativeElement.getContext('2d') as CanvasRenderingContext2D,
        );
    }

    resetCanvasAndImage(ctxCanvas: CanvasRenderingContext2D, ctxImage: CanvasRenderingContext2D) {
        this.resetCanvas(ctxCanvas);
        this.resetImage(ctxImage);
    }

    resetCanvas(ctxCanvas: CanvasRenderingContext2D) {
        ctxCanvas.clearRect(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
        this.updateImage();
    }

    resetImage(ctxImage: CanvasRenderingContext2D) {
        ctxImage.rect(0, 0, SIZE.x, SIZE.y);
        ctxImage.fillStyle = 'white';
        ctxImage.fill();
    }

    updateImage() {
        const ctx: CanvasRenderingContext2D = this.noContentCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        ctx.drawImage(this.img.nativeElement, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(this.canvas.nativeElement, 0, 0);
        this.drawService.$differenceImage.next(ctx.getImageData(0, 0, Canvas.WIDTH, Canvas.HEIGHT));
    }

    startDrawing(event: MouseEvent) {
        this.isClick = true;
        this.coordDraw = this.drawService.reposition(this.canvas.nativeElement, event);
        this.currentCommand = { name: '', stroke: { lines: [], style: { color: '', width: 0, cap: 'round' } } };
    }

    enterCanvas(event: MouseEvent) {
        //return event.buttons === 0 ? this.stopDrawing() : this.startDrawing(event);
    }

    leaveCanvas(event: MouseEvent) {}

    stopDrawing() {
        this.isClick = false;
        this.indexOfStroke++;
        if (this.pencil.state === 'Pencil') {
            this.currentCommand.name = 'draw';
        } else {
            this.currentCommand.name = 'erase';
        }
        this.commands[this.indexOfStroke] = this.currentCommand;
    }

    draw(event: MouseEvent) {
        if (!this.isClick || !this.pencil) {
            return;
        }
        const initCoord: Vec2 = { x: this.coordDraw.x, y: this.coordDraw.y };
        this.coordDraw = this.drawService.reposition(this.canvas.nativeElement, event);
        const finalCoord: Vec2 = { x: this.coordDraw.x, y: this.coordDraw.y };
        const line = { initCoord, finalCoord };
        this.currentCommand.stroke.lines.push(line);

        if (this.pencil.state === 'Pencil') {
            this.currentCommand.stroke.style = { color: this.pencil.color, cap: this.pencil.cap, width: this.pencil.width.pencil };
            this.execute.draw(line, this.currentCommand.stroke.style);
        } else {
            this.currentCommand.stroke.style = { color: this.pencil.color, cap: this.pencil.cap, width: this.pencil.width.eraser };
            this.execute.erase(line, this.currentCommand.stroke.style);
        }
    }
}
