import { Injectable } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';
import { Coordinate } from '@common/coordinate';
@Injectable({
    providedIn: 'root',
})
export class DifferencesDetectionHandlerService {
    mouseIsDisabled: boolean = false;

    constructor() {}
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
            { row: mousePosition.x, column: mousePosition.y },
            { row: mousePosition.x + 1, column: mousePosition.y },
            { row: mousePosition.x + 2, column: mousePosition.y },
            { row: mousePosition.x + 3, column: mousePosition.y },
            { row: mousePosition.x + 4, column: mousePosition.y },
            { row: mousePosition.x + 5, column: mousePosition.y },
            { row: mousePosition.x + 6, column: mousePosition.y },
            { row: mousePosition.x + 7, column: mousePosition.y },
            { row: mousePosition.x + 8, column: mousePosition.y },
        ];

        let counter = 0;
        let a = setInterval(function () {
            ctx.clearRect(mousePosition.x, mousePosition.y, 8 + 5, 1 + 5);
            if (counter === 5) {
                clearInterval(a);
            }
            if (counter % 2 === 0) {
                ctx.fillStyle = 'white';
                for (const coordinate of coords) {
                    ctx.fillRect(coordinate.row, coordinate.column, 5, 5);
                }
            }

            counter++;
        }, 500);
    }
}
