import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TimerService } from '@app/services/timer.service';
import { Subscription, timer } from 'rxjs';

@Component({
    selector: 'app-timer-countdown',
    templateUrl: './timer-countdown.component.html',
    styleUrls: ['./timer-countdown.component.scss'],
})
export class TimerCountdownComponent implements OnInit, OnDestroy {
    @Input() timerAdmin: string;
    @Input() clueAskedCounter: number = 0;

    @ViewChild('gameOverDialog')
    private readonly gameOverDialogRef: TemplateRef<HTMLElement>;

    timerDisplay: string;
    secondsLeft: number;

    // TODO : link timePenalty with input form admin
    // @Input() timerPenalty: number;
    /* eslint-disable @typescript-eslint/no-magic-numbers -- fixed value for now, will be changed later */
    private timePenalty: number = 5;

    // TODO : link nbDifferencesFound && bonusTime
    // @Input() bonusTime: number;
    // @Input() nbDifferencesFound: number;

    private timer: number;
    private sub: Subscription;

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

    /* eslint-disable @typescript-eslint/no-magic-numbers -- justify with method's name */
    moreThanFiveSeconds() {
        if (this.secondsLeft < 5) {
            return false;
        }
        return true;
    }

    private countdownTimer() {
        /* eslint-disable @typescript-eslint/no-magic-numbers -- 1000 for 1second */
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

    private gameOver() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = '50%';
        this.matDialog.open(this.gameOverDialogRef, dialogConfig);
    }
}
