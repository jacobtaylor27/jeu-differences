import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription, timer } from 'rxjs';
import { TimerService } from '../../services/timer.service';

@Component({
    selector: 'app-timer-countdown',
    templateUrl: './timer-countdown.component.html',
    styleUrls: ['./timer-countdown.component.scss'],
})
export class TimerCountdownComponent implements OnInit, OnDestroy {
    @Input() timerAdmin: string;
    @Input() clueAskedCounter: number = 0;

    // TODO : link timePenalty with input form admin
    // @Input() timerPenalty: number;
    private timePenalty: number = 5;

    // TODO : link nbDifferencesFound && bonusTime
    // @Input() bonusTime: number;
    // @Input() nbDifferencesFound: number;

    private timer: number;
    timerDisplay: string;
    secondsLeft: number;
    private sub: Subscription;

    @ViewChild('gameOverDialog')
    private readonly gameOverDialogRef: TemplateRef<HTMLElement>;

    constructor(private readonly matDialog: MatDialog, private readonly timerService: TimerService) {
        timerService.setCountdown();
    }

    ngOnInit(): void {
        this.setTimerService();
        this.countdownTimer();
    }

    ngOnDestroy(): void {
        this.stopTimer();
    }

    private countdownTimer() {
        const $time = timer(10, 1000);
        this.sub = $time.subscribe((seconds) => {
            this.setTimerService();
            this.timerDisplay = this.timerService.displayTime(seconds);
            this.secondsLeft = this.timerService.calculateSecondsLeft(seconds);
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
        // this.timer = Number(this.timerAdmin) + this. * this.nbDifferencesFound * this.bonusTime;
    }

    private setTimerService() {
        this.calculateTime();
        this.timerService.setTimer(this.timer);
    }

    moreThanFiveSeconds() {
        if (this.secondsLeft < 5) {
            return false;
        }
        return true;
    }

    private gameOver() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = '50%';
        this.matDialog.open(this.gameOverDialogRef, dialogConfig);
    }
}
