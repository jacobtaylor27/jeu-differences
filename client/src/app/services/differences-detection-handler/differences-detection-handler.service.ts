/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Injectable } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';
import { TimerService } from '@app/services/timer.service';
import { Coordinate } from '@common/coordinate';
@Injectable({
    providedIn: 'root',
})
export class DifferencesDetectionHandlerService {
    mouseIsDisabled: boolean = false;
    nbDifferencesFound: number;
    nbTotalDifferences: number;
    isGameOver: boolean = false;

    constructor(private timer: TimerService) {}

    setGameOver() {
        this.isGameOver = true;
    }

    setNumberDifferencesFound(nbDifferencesLeft: number, nbTotalDifference: number) {
        this.nbTotalDifferences = nbTotalDifference;
        this.nbDifferencesFound = nbTotalDifference - nbDifferencesLeft;
    }

    resetNumberDifferencesFound() {
        this.nbTotalDifferences = 0;
        this.nbDifferencesFound = 0;
    }

    playWrongSound() {
        this.playSound(new Audio('../assets/sounds/wronganswer.wav'));
    }

    playCorrectSound() {
        this.playSound(new Audio('../assets/sounds/correctanswer.wav'));
    }

    playSound(sound: HTMLAudioElement) {
        sound.play();
    }

    differenceNotDetected(mousePosition: Vec2, ctx: CanvasRenderingContext2D) {
        this.playWrongSound();
        ctx.fillStyle = 'red';
        ctx.fillText('Erreur', mousePosition.x, mousePosition.y, 30);
        this.mouseIsDisabled = true;

        // block
        setTimeout(() => {
            this.mouseIsDisabled = false;
            ctx.clearRect(mousePosition.x, mousePosition.y, 30, -30);
        }, 1000);
    }

    differenceDetected(ctx: CanvasRenderingContext2D, ctxModified: CanvasRenderingContext2D, coords: Coordinate[]) {
        this.playCorrectSound();
        this.timer.differenceFind.next();
        if (this.isGameOver) {
            this.timer.gameOver.next();
        }

        this.displayDifferenceTemp(ctx, coords);
        this.clearDifference(ctxModified, coords);
    }

    private displayDifferenceTemp(ctx: CanvasRenderingContext2D, coords: Coordinate[]) {
        let counter = 0;
        const interval = setInterval(() => {
            for (const coordinate of coords) {
                ctx.clearRect(coordinate.x, coordinate.y, 1, 1);
            }
            if (counter === 5) {
                clearInterval(interval);
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

    private clearDifference(ctx: CanvasRenderingContext2D, coords: Coordinate[]) {
        for (const coordinate of coords) {
            ctx.clearRect(coordinate.x, coordinate.y, 1, 1);
        }
    }
}
