import { CanvasState } from '@app/interfaces/canvas-state';
import { DrawingCommand } from '@app/interfaces/drawing-command';
import { DrawService } from '@app/services/draw-service/draw-service.service';

export class SwitchForegroundCommand implements DrawingCommand {
    leftCanvas: CanvasState;
    rightCanvas: CanvasState;

    constructor(leftCanvas: CanvasState, rightCanvas: CanvasState, private readonly drawService: DrawService) {
        this.leftCanvas = leftCanvas;
        this.rightCanvas = rightCanvas;
    }

    execute(): void {
        this.drawService.switchForegroundImageData(this.leftCanvas, this.rightCanvas);
    }
}
