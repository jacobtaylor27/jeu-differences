import { Injectable } from '@angular/core';
import { CanvasType } from '@app/enums/canvas-type';
import { CanvasState } from '@app/interfaces/canvas-state';

@Injectable({
    providedIn: 'root',
})
export class CanvasStateService {
    states: CanvasState[] = [];
    private focusedCanvas: CanvasType = CanvasType.None;

    getCanvasState(canvasType: CanvasType): CanvasState | undefined {
        return this.states.find((state) => state.canvasType === canvasType);
    }

    getFocusedCanvas(): CanvasState | undefined {
        return this.getCanvasState(this.focusedCanvas);
    }

    setFocusedCanvas(canvasState: CanvasType): void {
        this.focusedCanvas = canvasState;
    }
}
