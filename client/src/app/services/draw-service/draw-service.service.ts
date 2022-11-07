import { Injectable } from '@angular/core';
import { CanvasType } from '@app/enums/canvas-type';
import { Tool } from '@app/enums/tool';
import { Vec2 } from '@app/interfaces/vec2';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawService {
    $drawingImage: Map<CanvasType, Subject<ImageData>>;

    constructor(private toolService: ToolBoxService) {
        this.$drawingImage = new Map();
    }

    addDrawingCanvas(canvasType: CanvasType) {
        this.$drawingImage.set(canvasType, new Subject<ImageData>());
    }

    reposition(canvas: HTMLCanvasElement, event: MouseEvent): Vec2 {
        return { x: event.clientX - canvas.offsetLeft, y: event.clientY - canvas.offsetTop };
    }

    resetBackground(canvasType: CanvasType) {
        if (canvasType === CanvasType.Both) {
            this.toolService.$resetBackground.forEach((event: Subject<void>) => {
                event.next();
            });
            return;
        }
        this.toolService.$resetBackground.get(canvasType)?.next();
    }

    isEraser(pencilState: Tool) {
        return pencilState === Tool.Eraser;
    }
}
