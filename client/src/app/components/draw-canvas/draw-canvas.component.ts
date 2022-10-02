import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Tool } from '@app/enums/tool';
import { Pencil } from '@app/interfaces/pencil';
import { Vec2 } from '@app/interfaces/vec2';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { DEFAULT_DRAW_CLIENT, DEFAULT_PENCIL, DEFAULT_POSITION_MOUSE_CLIENT, SIZE } from '@app/constants/canvas';
import { Canvas } from '@app/enums/canvas';
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

    constructor(private toolBoxService: ToolBoxService, private drawService: DrawService) {
        this.toolBoxService.$pencil.subscribe((newPencil: Pencil) => {
            this.pencil = newPencil;
        });
    }

    ngAfterViewInit() {
        this.toolBoxService.$uploadImageInDiff.subscribe(async (newImage: ImageBitmap) => {
            this.img.nativeElement.getContext('2d')?.drawImage(newImage, 0, 0);
            await this.updateImage();
        });

        this.toolBoxService.$resetDiff.subscribe(async () => {
            (this.img.nativeElement.getContext('2d') as CanvasRenderingContext2D).clearRect(0, 0, SIZE.y, SIZE.x);
            (this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D).clearRect(0, 0, SIZE.y, SIZE.x);
            await this.updateImage();
        });
        this.updateImage();
    }

    async updateImage() {
        const ctx: CanvasRenderingContext2D = this.noContentCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        ctx.drawImage(this.img.nativeElement, 0, 0);
        ctx.drawImage(this.canvas.nativeElement, 0, 0);
        this.drawService.$differenceImage.next(ctx.getImageData(0, 0, Canvas.WIDTH, Canvas.HEIGHT));
    }

    // https://daily-dev-tips.com/posts/javascript-mouse-drawing-on-the-canvas/
    start(event: MouseEvent) {
        this.isClick = true;
        this.coordDraw = this.drawService.reposition(this.canvas.nativeElement, event);
    }

    stop() {
        this.isClick = false;
    }

    async draw(event: MouseEvent) {
        if (!this.isClick) {
            return;
        }
        if (this.pencil.state !== Tool.Pencil) {
            await this.erase(event);
            return;
        }
        await this.drawPoint(event);
    }

    async erase(event: MouseEvent) {
        const ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.coordDraw = this.drawService.reposition(this.canvas.nativeElement, event);
        ctx.clearRect(this.coordDraw.x, this.coordDraw.y, this.pencil.width, this.pencil.width);
        await this.updateImage();
    }

    async drawPoint(event: MouseEvent) {
        const ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        ctx.beginPath();
        ctx.lineWidth = this.pencil.width;
        ctx.lineCap = this.pencil.cap;
        ctx.strokeStyle = this.pencil.color;
        ctx.moveTo(this.coordDraw.x, this.coordDraw.y);
        this.coordDraw = this.drawService.reposition(this.canvas.nativeElement, event);
        ctx.lineTo(this.coordDraw.x, this.coordDraw.y);
        ctx.stroke();
        await this.updateImage();
    }
}
