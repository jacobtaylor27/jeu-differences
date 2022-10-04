/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Injectable } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';
import { Coordinate } from '@common/coordinate';
@Injectable({
    providedIn: 'root',
})
export class DifferencesDetectionHandlerService {
    mouseIsDisabled: boolean = false;

    difference(mousePosition: Vec2, ctx: CanvasRenderingContext2D) {
        if (this.isADifference(mousePosition)) {
            this.differenceDetected(ctx, mousePosition);
        } else {
            this.differenceNotDetected(mousePosition, ctx);
        }
    }

    private isADifference(mousePosition: Vec2): boolean {
        // LOGIC
        return mousePosition.x > 250;
    }

    private differenceNotDetected(mousePosition: Vec2, ctx: CanvasRenderingContext2D) {
        const wrongSound = new Audio('../assets/sounds/wronganswer.wav');
        wrongSound.play();
        ctx.fillText('Erreur', mousePosition.x, mousePosition.y, 30);
        this.mouseIsDisabled = true;

        // block
        setTimeout(() => {
            this.mouseIsDisabled = false;
            ctx.clearRect(mousePosition.x, mousePosition.y, 30, -30);
        }, 1000);
    }

    private differenceDetected(ctx: CanvasRenderingContext2D, mousePosition: Vec2) {
        const correctSound = new Audio('../assets/sounds/correctanswer.wav');
        correctSound.play();

        this.displayDifferenceTemp(ctx, mousePosition);
    }

    private displayDifferenceTemp(ctx: CanvasRenderingContext2D, mousePosition: Vec2) {
        const coords: Coordinate[] = [
            { x: mousePosition.x, y: mousePosition.y },
            { x: mousePosition.x + 1, y: mousePosition.y },
            { x: mousePosition.x + 2, y: mousePosition.y },
            { x: mousePosition.x + 3, y: mousePosition.y },
            { x: mousePosition.x + 4, y: mousePosition.y },
            { x: mousePosition.x + 5, y: mousePosition.y },
            { x: mousePosition.x + 6, y: mousePosition.y },
            { x: mousePosition.x + 7, y: mousePosition.y },
            { x: mousePosition.x + 8, y: mousePosition.y },
        ];

        let counter = 0;
        const a = setInterval(() => {
            ctx.clearRect(mousePosition.x, mousePosition.y, 8 + 5, 1 + 5);
            if (counter === 5) {
                clearInterval(a);
            }
            if (counter % 2 === 0) {
                ctx.fillStyle = 'white';
                for (const coordinate of coords) {
                    ctx.fillRect(coordinate.x, coordinate.y, 5, 5);
                }
            }

            counter++;
        }, 500);
    }
}
