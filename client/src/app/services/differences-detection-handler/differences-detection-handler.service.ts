import { Injectable } from '@angular/core';
import { SIZE } from '@app/constants/canvas';
import { Vec2 } from '@app/interfaces/vec2';
@Injectable({
    providedIn: 'root',
})
export class DifferencesDetectionHandlerService {
    wrongSound = new Audio('../assets/sounds/wronganswer.wav');
    correctSound = new Audio('../assets/sounds/correctanswer.wav');
    mouseIsDisabled: boolean = false;

    difference(mousePosition: Vec2, ctx: CanvasRenderingContext2D) {
        if (this.isADifference(mousePosition)) {
            this.differenceDetected();
        } else {
            this.differenceNotDetected(mousePosition, ctx);
        }
    }

    private isADifference(mousePosition: Vec2): boolean {
        // LOGIC
        return mousePosition.x > 250;
    }

    private differenceDetected() {
        this.correctSound.play();
    }

    private differenceNotDetected(mousePosition: Vec2, ctx: CanvasRenderingContext2D) {
        this.wrongSound.play();
        console.log(mousePosition.x, mousePosition.y);
        ctx.fillText('Erreur', mousePosition.x, mousePosition.y);
        this.mouseIsDisabled = true;

        // block
        setTimeout(() => {
            this.mouseIsDisabled = false;
            ctx.clearRect(0, 0, SIZE.x, SIZE.y);
        }, 1000);
    }
}
