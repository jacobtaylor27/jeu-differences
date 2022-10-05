import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TimerService {
    differenceFind: Subject<void> = new Subject();
    gameOver: Subject<void> = new Subject();
    nbOfDifferencesFound: number = 0;
    private timer: number;
    private isCountdown: boolean = false;
    private secondsDisplay: string;
    private minutesDisplay: string;

    setTimer(timer: number) {
        this.timer = timer;
    }

    setCountdown() {
        this.isCountdown = true;
    }

    setNbOfDifferencesFound() {
        this.nbOfDifferencesFound += 1;
    }

    resetNbDifferencesFound() {
        this.nbOfDifferencesFound = 0;
    }

    calculateSecondsLeft(totalSeconds: number): number {
        return this.timer - totalSeconds;
    }

    displayTime(totalSeconds: number): string {
        this.calculateSeconds(totalSeconds);
        this.calculateMinutes(totalSeconds);
        return (
            /* eslint-disable @typescript-eslint/no-magic-numbers -- 1minute is 60 seconds */
            (this.minutesDisplay && Number(this.minutesDisplay) < 60 ? this.minutesDisplay : '00') +
            ' : ' +
            (this.secondsDisplay && Number(this.secondsDisplay) < 60 ? this.secondsDisplay : '00')
        );
    }

    /* eslint-disable @typescript-eslint/no-magic-numbers -- minute is 60 seconds */
    private calculateSeconds(totalSeconds: number) {
        if (this.isCountdown) {
            this.secondsDisplay = this.pad((this.timer - totalSeconds) % 60).toString();
        } else {
            this.secondsDisplay = this.pad(totalSeconds % 60).toString();
        }
    }

    /* eslint-disable @typescript-eslint/no-magic-numbers -- minute is 60 seconds */
    private calculateMinutes(totalSeconds: number) {
        if (this.isCountdown) {
            this.minutesDisplay = this.pad(Math.floor((this.timer - totalSeconds) / 60) % 60).toString();
        } else {
            this.minutesDisplay = this.pad(Math.floor(totalSeconds / 60) % 60).toString();
        }
    }

    /* eslint-disable @typescript-eslint/no-magic-numbers -- 9 is max digit */
    private pad(digit: number) {
        return digit <= 9 ? '0' + digit : digit;
    }
}
