import { Injectable } from '@angular/core';
import { DifferencesDetectionHandlerService } from '../differences-detection-handler/differences-detection-handler.service';

@Injectable({
    providedIn: 'root',
})
export class MouseHandlerService {
    constructor(private readonly differencesDetectionHandlerService: DifferencesDetectionHandlerService) {}

    mouseHitDetect($event: MouseEvent, ctx: CanvasRenderingContext2D, gameId: string) {
        const mousePosition = { x: $event.offsetX, y: $event.offsetY };
        this.differencesDetectionHandlerService.getDifferenceValidation(gameId, mousePosition, ctx);
    }
}
