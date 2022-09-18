import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, timer } from 'rxjs';

@Component({
    selector: 'app-timer-countdown',
    templateUrl: './timer-countdown.component.html',
    styleUrls: ['./timer-countdown.component.scss'],
})
export class TimerCountdownComponent implements OnInit, OnDestroy {
    @Input() timerAdmin: string;
    secondsDisplay: number;
    minutesDisplay: number;
    secondsLeft: number;
    sub: Subscription;

    @ViewChild('gameOverDialog')
    private readonly gameOverDialogRef: TemplateRef<HTMLElement>;

    constructor(private readonly matDialog: MatDialog) {}

    ngOnInit(): void {
        this.countdownTimer();
    }

    ngOnDestroy(): void {
        this.stopTimer();
    }

    private countdownTimer() {
        const $time = timer(0, 1000);
        this.sub = $time.subscribe((seconds) => {
            if (seconds === Number(this.timerAdmin) + 1) {
                this.stopTimer();
                this.gameOver();
                return;
            }
            console.log(seconds);
            this.displaySeconds(seconds);
            this.displayMinutes(seconds);
            this.caculateSecondsLeft(seconds);
        });
    }

    private stopTimer() {
        this.sub.unsubscribe();
    }
    private displaySeconds(totalSeconds: number) {
        this.secondsDisplay = this.pad((Number(this.timerAdmin) - totalSeconds) % 60);
    }
    private displayMinutes(totalSeconds: number) {
        this.minutesDisplay = this.pad(Math.floor((Number(this.timerAdmin) - totalSeconds) / 60) % 60);
    }

    private caculateSecondsLeft(totalSeconds: number) {
        this.secondsLeft = Number(this.timerAdmin) - totalSeconds;
    }

    displayTime(): string {
        return (
            (this.minutesDisplay && this.minutesDisplay <= 59 ? this.minutesDisplay : '00') +
            ' : ' +
            (this.secondsDisplay && this.secondsDisplay <= 59 ? this.secondsDisplay : '00')
        );
    }

    private pad(digit: any) {
        return digit <= 9 ? '0' + digit : digit;
    }

    private gameOver() {
        this.matDialog.open(this.gameOverDialogRef);
    }
}
