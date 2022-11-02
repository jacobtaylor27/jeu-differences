import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DEFAULT_DRAW_CLIENT, DEFAULT_PENCIL, DEFAULT_POSITION_MOUSE_CLIENT, SIZE } from '@app/constants/canvas';
import { Canvas } from '@app/enums/canvas';
import { Pencil } from '@app/interfaces/pencil';
import { Vec2 } from '@app/interfaces/vec2';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

interface Stroke {
    lines: Line[];
    color: string;
    width: number;
    cap: string;
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
    currentCommand: Command = { name: '', stroke: { lines: [], color: '', width: 0, cap: '' } };
    execute = {
        draw: (coordInit: Vec2, coordFinal: Vec2) => {
            const ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            ctx.beginPath();
            ctx.lineWidth = this.pencil.width.pencil;
            ctx.lineCap = this.pencil.cap;
            ctx.strokeStyle = this.pencil.color;
            ctx.moveTo(coordInit.x, coordInit.y);
            ctx.lineTo(coordFinal.x, coordFinal.y);
            ctx.stroke();
            this.updateImage();
        },
        erase: (coordInit: Vec2, coordFinal: Vec2) => {
            const ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            ctx.beginPath();
            ctx.lineWidth = this.pencil.width.eraser;
            ctx.lineCap = this.pencil.cap;
            ctx.strokeStyle = '#000000';
            ctx.moveTo(coordInit.x, coordInit.y);
            ctx.lineTo(coordFinal.x, coordFinal.y);
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
                this.execute.draw(line.initCoord, line.finalCoord);
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
        this.currentCommand = { name: '', stroke: { lines: [], color: '', width: 0, cap: '' } };
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
        // TODO: Faire la distinction entre le crayon et l'efface
        const initCoord: Vec2 = { x: this.coordDraw.x, y: this.coordDraw.y };
        this.coordDraw = this.drawService.reposition(this.canvas.nativeElement, event);
        const finalCoord: Vec2 = { x: this.coordDraw.x, y: this.coordDraw.y };
        this.currentCommand.stroke.lines.push({ initCoord, finalCoord });
        if (this.pencil.state === 'Pencil') {
            this.execute.draw(initCoord, finalCoord);
        } else {
            this.execute.erase(initCoord, finalCoord);
        }
    }
}
