import { Injectable } from '@angular/core';
import { PropagateCanvasEvent } from '@app/enums/propagate-canvas-event';
import { Vec2 } from '@app/interfaces/vec2';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawService {
    $differenceImage: Subject<ImageData>;
    constructor(private toolService: ToolBoxService) {
        this.$differenceImage = new Subject();
    }
    reposition(canvas: HTMLCanvasElement, event: MouseEvent): Vec2 {
        return { x: event.clientX - canvas.offsetLeft, y: event.clientY - canvas.offsetTop };
    }

    reset(canvas: PropagateCanvasEvent) {
        if (this.isCanvasSelected(canvas, PropagateCanvasEvent.Difference)) {
            this.toolService.$resetDiff.next();
        }
        if (this.isCanvasSelected(canvas, PropagateCanvasEvent.Source)) {
            this.toolService.$resetSource.next();
        }
    }

    private isCanvasSelected(canvas: PropagateCanvasEvent, specificCanvas: PropagateCanvasEvent) {
        return canvas === PropagateCanvasEvent.Both || canvas === specificCanvas;
    }
}
