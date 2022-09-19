import { Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
    selector: 'app-timer-stopwatch',
    templateUrl: './timer-stopwatch.component.html',
    styleUrls: ['./timer-stopwatch.component.scss'],
})
export class TimerStopwatchComponent implements OnInit {
    minutesInitial: number = 2;
    secondsInitial: number = 0;
    valueTimer: number = 0;

    minutesDisplay: number = 0;
    secondsDisplay: number = 0;

    sub: Subscription;

    ngOnInit(): void {
        this.startTimer();
    }

    ngOnDestroy(): void {
        this.stopTimer();
    }

    private startTimer() {
        const time = timer(1, 1000);
        this.sub = time.subscribe((seconds) => {
            this.secondsDisplay = this.getSeconds(seconds);
            this.minutesDisplay = this.getMinutes(seconds);
        });
    }

    private stopTimer() {
        this.sub.unsubscribe();
    }

    private getSeconds(ticks: number) {
        return this.pad(ticks % 60);
    }

    private getMinutes(ticks: number) {
        return this.pad(Math.floor(ticks / 60) % 60);
    }

    private pad(digit: any) {
        return digit <= 9 ? '0' + digit : digit;
    }

    displayTime(): string {
        return (
            (this.minutesDisplay && this.minutesDisplay <= 59 ? this.minutesDisplay : '00') +
            ' : ' +
            (this.secondsDisplay && this.secondsDisplay <= 59 ? this.secondsDisplay : '00')
        );
    }
}
