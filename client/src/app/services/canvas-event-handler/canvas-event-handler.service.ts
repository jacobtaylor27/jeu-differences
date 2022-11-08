import { Injectable } from '@angular/core';
import { CanvasStateService } from '@app/services/canvas-state/canvas-state.service';
import { DrawService } from '../draw-service/draw-service.service';

@Injectable({
    providedIn: 'root',
})
export class CanvasEventHandlerService {
    constructor(private canvasStateService: CanvasStateService, private drawingService: DrawService) {}

    handleCtrlShiftZ() {
        this.drawingService.redo(this.canvasStateService.focusedCanvas);
    }

    handleCtrlZ() {
        this.drawingService.undo();
    }
}
