import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Tool } from '@app/constant/tool';
import { Vec2 } from '@app/interfaces/vec2';
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

    // https://daily-dev-tips.com/posts/javascript-mouse-drawing-on-the-canvas/
    start(event: MouseEvent) {
        this.isClick = true;
        this.reposition(event);
    }

    stop() {
        this.isClick = false;
    }

    draw(event: MouseEvent) {
        if (!this.isClick) {
            return;
        }
        console.log('hello');
        const ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.coordDraw.x, this.coordDraw.y);
        this.reposition(event);
        ctx.lineTo(this.coordDraw.x, this.coordDraw.y);
        ctx.stroke();
    }

    reposition(event: MouseEvent) {
        this.coordDraw.x = event.clientX - this.canvas.nativeElement.offsetLeft;
        this.coordDraw.y = event.clientY - this.canvas.nativeElement.offsetTop;
    }
}
