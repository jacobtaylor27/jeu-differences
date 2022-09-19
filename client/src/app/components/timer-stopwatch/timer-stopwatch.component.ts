import { Component, Input, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
    selector: 'app-timer-stopwatch',
    templateUrl: './timer-stopwatch.component.html',
    styleUrls: ['./timer-stopwatch.component.scss'],
})
export class TimerStopwatchComponent implements OnInit {
    @Input() clueAskedCounter: number;

    minutesDisplay: number = 0;
    secondsDisplay: number = 0;
    secondsTotal: number;

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
            this.calculateTime(seconds);
            this.secondsDisplay = this.getSeconds(this.secondsTotal);
            this.minutesDisplay = this.getMinutes(this.secondsTotal);
        });
    }

    private stopTimer() {
        this.sub.unsubscribe();
    }

    private getSeconds(seconds: number) {
        return this.pad(seconds % 60);
    }

    private getMinutes(seconds: number) {
        return this.pad(Math.floor(seconds / 60) % 60);
    }

    private pad(digit: any) {
        return digit <= 9 ? '0' + digit : digit;
    }

    private calculateTime(seconds: number) {
        this.secondsTotal = seconds + this.clueAskedCounter * 5;
    }

    displayTime(): string {
        return (
            (this.minutesDisplay && this.minutesDisplay <= 59 ? this.minutesDisplay : '00') +
            ' : ' +
            (this.secondsDisplay && this.secondsDisplay <= 59 ? this.secondsDisplay : '00')
        );
    }
}
