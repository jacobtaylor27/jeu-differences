import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DEFAULT_DRAW_CLIENT, DEFAULT_PENCIL, DEFAULT_POSITION_MOUSE_CLIENT, SIZE } from '@app/constants/canvas';
import { Canvas } from '@app/enums/canvas';
import { Tool } from '@app/enums/tool';
import { Pencil } from '@app/interfaces/pencil';
import { Vec2 } from '@app/interfaces/vec2';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

interface Stroke {
    lines: Line[];
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
    currentCommand: Command = { name: 'draw', stroke: { lines: [] } };
    commandType = {
        draw: (coordInit: Vec2, coordFinal: Vec2) => {
            const ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            ctx.beginPath();
            ctx.lineWidth = this.pencil.width.pencil;
            ctx.lineCap = this.pencil.cap;
            ctx.strokeStyle = Tool.Pencil;
            ctx.moveTo(coordInit.x, coordInit.y);
            ctx.lineTo(coordFinal.x, coordFinal.y);
            ctx.stroke();
            this.updateImage();
        },
        erase: (event: MouseEvent) => {
            this.coordDraw = this.drawService.reposition(this.canvas.nativeElement, event);
            const ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            ctx.beginPath();
            ctx.lineWidth = this.pencil.width.eraser;
            ctx.lineCap = this.pencil.cap;
            ctx.strokeStyle = 'white';
            ctx.moveTo(this.coordDraw.x, this.coordDraw.y);
            ctx.lineTo(this.coordDraw.x, this.coordDraw.y);
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
        console.log('handleCtrlShiftZ was handled');
    }

    handleCtrlZ() {
        this.resetCanvas(this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D);
        this.commands.splice(-1, 1);

        this.commands.forEach((command) => {
            if (command.name === 'draw') {
                command.stroke.lines.forEach((line) => {
                    this.commandType.draw(line.initCoord, line.finalCoord);
                });
            } else {
                // this.commandType.erase(command.event);
            }
        });
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
        this.currentCommand = { name: 'draw', stroke: { lines: [] } };
    }

    enterCanvas(event: MouseEvent) {
        return event.buttons === 0 ? this.stopDrawing() : this.startDrawing(event);
    }

    stopDrawing() {
        this.isClick = false;
        this.commands.push(this.currentCommand);
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
        this.pushAndApplyCommand({ name: 'draw', stroke: this.currentCommand.stroke });
    }

    pushAndApplyCommand(command: Command) {
        const lastLine = command.stroke.lines[command.stroke.lines.length - 1];
        this.commandType.draw(lastLine.initCoord, lastLine.finalCoord);
    }
}
