import { Component, OnInit } from '@angular/core';

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
    reposition(event: MouseEvent) {
        this.coordDraw.x = event.clientX - this.canvas.nativeElement.offsetLeft;
        this.coordDraw.y = event.clientY - this.canvas.nativeElement.offsetTop;
    }
}
