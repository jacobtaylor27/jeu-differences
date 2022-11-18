import { CanvasState } from '@app/interfaces/canvas-state';
import { Command } from '@app/interfaces/command';
import { DrawingCommand } from '@app/interfaces/drawing-command';
import { DrawService } from '@app/services/draw-service/draw-service.service';

export class PasteExternalForegroundOnCommand implements DrawingCommand {
    command: Command;
    firstCanvas: CanvasState;
    secondCanvas: CanvasState;

    constructor(command: Command, firstCanvas: CanvasState, secondCanvas: CanvasState, private readonly drawService: DrawService) {
        this.command = command;
        this.firstCanvas = firstCanvas;
        this.secondCanvas = secondCanvas;
    }
    execute(): void {
        this.drawService.pasteImageDataOn(this.firstCanvas, this.secondCanvas);
    }
}
