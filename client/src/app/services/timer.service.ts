import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TimerService {
    private timer: number;
    private isCountdown: boolean = false;
    private secondsDisplay: number;
    private minutesDisplay: number;

    constructor() {}

    setTimer(timer: number) {
        this.timer = timer;
    }

    setCountdown() {
        this.isCountdown = true;
    }

    private calculateSeconds(totalSeconds: number) {
        if (this.isCountdown) {
            this.secondsDisplay = this.pad((this.timer - totalSeconds) % 60);
        } else {
            this.secondsDisplay = this.pad(totalSeconds % 60);
        }
    }

    private calculateMinutes(totalSeconds: number) {
        if (this.isCountdown) {
            this.minutesDisplay = this.pad(Math.floor((this.timer - totalSeconds) / 60) % 60);
        } else {
            this.minutesDisplay = this.pad(Math.floor(totalSeconds / 60) % 60);
        }
    }

    calculateSecondsLeft(totalSeconds: number): number {
        return this.timer - totalSeconds;
    }

    displayTime(totalSeconds: number): string {
        this.calculateSeconds(totalSeconds);
        this.calculateMinutes(totalSeconds);
        return (
            (this.minutesDisplay && this.minutesDisplay <= 59 ? this.minutesDisplay : '00') +
            ' : ' +
            (this.secondsDisplay && this.secondsDisplay <= 59 ? this.secondsDisplay : '00')
        );
    }

    private pad(digit: any) {
        return digit <= 9 ? '0' + digit : digit;
    }
}
