import { DrawingCommand } from '@app/interfaces/drawing-command';
import { DrawService } from '@app/services/draw-service/draw-service.service';

export class ClearForegroundCommand implements DrawingCommand {
    constructor(private readonly drawService: DrawService) {}

    execute() {
        this.drawService.clearAllForegrounds();
    }
}
