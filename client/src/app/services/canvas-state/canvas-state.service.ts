import { Injectable } from '@angular/core';
import { CanvasType } from '@app/enums/canvas-type';

interface CanvasState {
    canvasType: CanvasType;
    foreground: HTMLCanvasElement;
    background: HTMLCanvasElement;
}

@Injectable({
    providedIn: 'root',
})
export class CanvasStateService {
    constructor() {}
}
