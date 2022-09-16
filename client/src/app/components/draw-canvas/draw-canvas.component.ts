import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Tool } from '@app/constant/tool';
import { Pencil } from '@app/interfaces/pencil';
import { Vec2 } from '@app/interfaces/vec2';
import { DrawService } from '@app/services/draw-service/draw-service.service';
@Component({
    selector: 'app-draw-canvas',
    templateUrl: './draw-canvas.component.html',
    styleUrls: ['./draw-canvas.component.scss'],
})
export class DrawCanvasComponent {
    @Input() tool: Tool;
    @Input() color: string = '#000000';
    @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
    coordDraw: Vec2 = { x: 0, y: 0 };
    isClick: boolean = false;
    pencil: Pencil = { width: 5, cap: 'round', color: this.color };
    constructor(private drawService: DrawService) {}

    // https://daily-dev-tips.com/posts/javascript-mouse-drawing-on-the-canvas/
    start(event: MouseEvent) {
        this.isClick = true;
        this.coordDraw = this.drawService.reposition(this.canvas.nativeElement, event);
    }

    stop() {
        this.isClick = false;
    }

    draw(event: MouseEvent) {
        if (!this.isClick) {
            return;
        }
        this.drawPoint(event);
    }

    drawPoint(event: MouseEvent) {
        const ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        ctx.beginPath();
        ctx.lineWidth = this.pencil.width;
        ctx.lineCap = this.pencil.cap;
        ctx.strokeStyle = this.pencil.color;
        ctx.moveTo(this.coordDraw.x, this.coordDraw.y);
        this.coordDraw = this.drawService.reposition(this.canvas.nativeElement, event);
        ctx.lineTo(this.coordDraw.x, this.coordDraw.y);
        ctx.stroke();
    }
}
