import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';

@Component({
    selector: 'app-canvas-selector',
    templateUrl: './canvas-selector.component.html',
    styleUrls: ['./canvas-selector.component.scss'],
})
export class CanvasSelectorComponent {
    @Output() canvasSelector = new EventEmitter<{ draw: boolean; compare: boolean }>();
    @ViewChild('drawCanvas', { static: false }) drawCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('compareCanvas', { static: false }) compareCanvas!: ElementRef<HTMLCanvasElement>;
    size: Vec2 = { x: 300, y: 300 };
    isCanvasSelect = { draw: false, compare: false };

    select(typeCanvas: string, event: Event) {
        const ctx: CanvasRenderingContext2D = (event.target as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D;
        const canvasState = this.canvasManager(ctx, typeCanvas);
        this.isCanvasSelect.compare = typeCanvas === 'compare' ? canvasState : this.isCanvasSelect.compare;
        this.isCanvasSelect.draw = typeCanvas === 'draw' ? canvasState : this.isCanvasSelect.draw;
        this.canvasSelector.emit(this.isCanvasSelect);
    }

    canvasManager(ctx: CanvasRenderingContext2D, typeCanvas: string) {
        if (this.isOneCanvasSelect(typeCanvas)) {
            this.draw(ctx);
        } else {
            this.erase(ctx);
        }
        return this.isOneCanvasSelect(typeCanvas);
    }

    isOneCanvasSelect(typeCanvas: string) {
        return (!this.isCanvasSelect.compare && typeCanvas === 'compare') || (!this.isCanvasSelect.draw && typeCanvas === 'draw');
    }

    erase(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, this.size.x, this.size.y);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.rect(0, 0, this.size.x, this.size.y);
        ctx.fillStyle = 'gray';
        ctx.fill();
    }
}
