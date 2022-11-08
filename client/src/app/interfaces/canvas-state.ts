import { CanvasType } from '@app/enums/canvas-type';

export interface CanvasState {
    canvasType: CanvasType;
    foreground: HTMLCanvasElement;
    background: HTMLCanvasElement;
}
