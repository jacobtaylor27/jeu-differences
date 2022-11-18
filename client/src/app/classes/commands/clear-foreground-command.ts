import { Command } from '@app/interfaces/command';
import { DrawingCommand } from '@app/interfaces/drawing-command';
import { DrawService } from '@app/services/draw-service/draw-service.service';

export class ClearForegroundCommand implements DrawingCommand {
    command: Command;
    foreground: CanvasRenderingContext2D;

    constructor(command: Command, foreground: CanvasRenderingContext2D, private readonly drawService: DrawService) {
        this.command = command;
        this.foreground = foreground;
    }

    execute() {
        this.drawService.clearForeground(this.foreground);
    }
}
