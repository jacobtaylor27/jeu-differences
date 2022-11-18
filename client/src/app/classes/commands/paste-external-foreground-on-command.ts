import { CanvasState } from '@app/interfaces/canvas-state';
import { DrawingCommand } from '@app/interfaces/drawing-command';
import { DrawService } from '@app/services/draw-service/draw-service.service';

export class PasteExternalForegroundOnCommand implements DrawingCommand {
    private firstCanvas: CanvasState;
    private secondCanvas: CanvasState;

    constructor(firstCanvas: CanvasState, secondCanvas: CanvasState, private readonly drawService: DrawService) {
        this.firstCanvas = firstCanvas;
        this.secondCanvas = secondCanvas;
    }
    execute(): void {
        this.drawService.pasteImageDataOn(this.firstCanvas, this.secondCanvas);
    }
}
