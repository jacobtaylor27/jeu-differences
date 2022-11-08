import { Injectable } from '@angular/core';
import { CanvasType } from '@app/enums/canvas-type';
import { CanvasState } from '@app/interfaces/canvas-state';

@Injectable({
    providedIn: 'root',
})
export class CanvasStateService {
    states: CanvasState[] = [];
    private focusedCanvas: CanvasType;

    getCanvasState(canvasType: CanvasType) {
        return this.states.find((state) => state.canvasType === canvasType);
    }

    getFocusedCanvas() {
        return this.getCanvasState(this.focusedCanvas);
    }

    setFocusCanvas(canvasState: CanvasType) {
        this.focusedCanvas = canvasState;
    }
}
