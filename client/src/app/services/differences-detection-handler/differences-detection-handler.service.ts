import { Injectable } from '@angular/core';
import { SIZE } from '@app/constants/canvas';
import { Vec2 } from '@app/interfaces/vec2';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';
@Injectable({
    providedIn: 'root',
})
export class DifferencesDetectionHandlerService {
    wrongSound = new Audio('../assets/sounds/wronganswer.wav');

    constructor(private readonly mouseHandlerService: MouseHandlerService) {}

    difference($event: MouseEvent) {
        if (this.isADifference($event)) {
            this.differenceDetected();
        } else {
            this.differenceNotDetected;
        }
    }

    private isADifference($event: MouseEvent): boolean {
        // LOGIC
        const position: Vec2 = this.mouseHandlerService.mouseHitDetect($event);
        return position.x > 250;
    }

    private differenceDetected() {}

    private differenceNotDetected(ctx: CanvasRenderingContext2D) {
        this.wrongSound.play();
        ctx.fillText('Erreur !', 10, 50);
        setTimeout(function () {
            ctx.clearRect(0, 0, SIZE.x, SIZE.y);
        }, 1000);
    }
}
