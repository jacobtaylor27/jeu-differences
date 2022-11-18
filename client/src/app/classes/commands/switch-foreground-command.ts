import { CanvasState } from '@app/interfaces/canvas-state';
import { Command } from '@app/interfaces/command';
import { DrawingCommand } from '@app/interfaces/drawing-command';
import { DrawService } from '@app/services/draw-service/draw-service.service';

export class SwitchForegroundCommand implements DrawingCommand {
    command: Command;
    leftCanvas: CanvasState;
    rightCanvas: CanvasState;

    constructor(command: Command, leftCanvas: CanvasState, rightCanvas: CanvasState, private readonly drawService: DrawService) {
        this.leftCanvas = leftCanvas;
        this.rightCanvas = rightCanvas;
        this.command = command;
    }

    execute(): void {
        this.drawService.switchForegroundImageData(this.leftCanvas, this.rightCanvas);
    }
}
