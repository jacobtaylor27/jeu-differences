import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription, timer } from 'rxjs';

@Component({
    selector: 'app-timer-countdown',
    templateUrl: './timer-countdown.component.html',
    styleUrls: ['./timer-countdown.component.scss'],
})
export class TimerCountdownComponent implements OnInit, OnDestroy {
    @Input() timerAdmin: string;
    @Input() clueAskedCounter: number;

    // TODO : link timePenalty with input form admin
    // @Input() timerPenalty: number;
    private timePenalty: number = 5;

    // TODO : link nbDifferencesFound && bonusTime
    // @Input() bonusTime: number;
    // @Input() nbDifferencesFound: number;

    private timer: number;
    private secondsDisplay: number;
    private minutesDisplay: number;
    secondsLeft: number;
    private sub: Subscription;

    @ViewChild('gameOverDialog')
    private readonly gameOverDialogRef: TemplateRef<HTMLElement>;

    constructor(private readonly matDialog: MatDialog) {}

    ngOnInit(): void {
        this.calculateTime();
        this.countdownTimer();
    }

    ngOnDestroy(): void {
        this.stopTimer();
    }

    private countdownTimer() {
        const $time = timer(100, 1000);

        this.sub = $time.subscribe((seconds) => {
            this.calculateTime();
            this.calculateSeconds(seconds);
            this.calculateMinutes(seconds);
            this.calculateSecondsLeft(seconds);
            if (seconds > this.timer) {
                this.stopTimer();
                this.gameOver();
                return;
            }
        });
    }

    private stopTimer() {
        this.sub.unsubscribe();
    }

    // TODO : add time when users finds a difference
    private calculateTime() {
        this.timer = Number(this.timerAdmin) - this.clueAskedCounter * this.timePenalty;
    }

    private calculateSeconds(totalSeconds: number) {
        this.secondsDisplay = this.pad((this.timer - totalSeconds) % 60);
    }
    private calculateMinutes(totalSeconds: number) {
        this.minutesDisplay = this.pad(Math.floor((this.timer - totalSeconds) / 60) % 60);
    }

    private calculateSecondsLeft(totalSeconds: number) {
        this.secondsLeft = this.timer - totalSeconds;
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
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = '50%';
        this.matDialog.open(this.gameOverDialogRef, dialogConfig);
    }
}
