/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Injectable } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';
import { Coordinate } from '@common/coordinate';
@Injectable({
    providedIn: 'root',
})
export class DifferencesDetectionHandlerService {
    mouseIsDisabled: boolean = false;

    differenceNotDetected(mousePosition: Vec2, ctx: CanvasRenderingContext2D) {
        const wrongSound = new Audio('../assets/sounds/wronganswer.wav');
        wrongSound.play();
        ctx.fillStyle = 'red';
        ctx.fillText('Erreur', mousePosition.x, mousePosition.y, 30);
        this.mouseIsDisabled = true;

        // block
        setTimeout(() => {
            this.mouseIsDisabled = false;
            ctx.clearRect(mousePosition.x, mousePosition.y, 30, -30);
        }, 1000);
    }

    differenceDetected(mousePosition: Vec2, ctx: CanvasRenderingContext2D, coords: Coordinate[]) {
        const correctSound = new Audio('../assets/sounds/correctanswer.wav');
        correctSound.play();

        this.displayDifferenceTemp(ctx, mousePosition, coords);
    }

    private displayDifferenceTemp(ctx: CanvasRenderingContext2D, mousePosition: Vec2, coords: Coordinate[]) {
        let counter = 0;
        const a = setInterval(() => {
            for (const coordinate of coords) {
                ctx.clearRect(coordinate.x, coordinate.y, 1, 1);
            }
            if (counter === 5) {
                clearInterval(a);
            }
            if (counter % 2 === 0) {
                ctx.fillStyle = 'yellow';
                for (const coordinate of coords) {
                    ctx.fillRect(coordinate.x, coordinate.y, 1, 1);
                }
            }

            counter++;
        }, 500);
    }
}
