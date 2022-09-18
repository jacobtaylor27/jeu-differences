import { Component } from '@angular/core';
import { TimerService } from '@app/services/timer.service';
import { Subscription, timer } from 'rxjs';

@Component({
    selector: 'app-timer-countdown',
    templateUrl: './timer-countdown.component.html',
    styleUrls: ['./timer-countdown.component.scss'],
})
export class TimerCountdownComponent {
    private timerValue: number;
    secondsDisplay: number;
    minutesDisplay: number;
    sub: Subscription;
    constructor(timerService: TimerService) {
        // console.log(timerService.timer.getValue());
        this.timerValue = Number(timerService.timer.getValue());
        console.log(this.timerValue);
        this.countdownTimer();
    }
    private countdownTimer() {
        const $time = timer(0, 1000);
        this.sub = $time.subscribe((seconds) => {
            if (seconds === this.timerValue + 1) {
                this.stopTimer();
                return;
            }
            this.displaySeconds(seconds);
            this.displayMinutes(seconds);
        });
    }
    private stopTimer() {
        this.sub.unsubscribe();
    }
    private displaySeconds(ticks: number) {
        this.secondsDisplay = this.pad(this.timerValue % 60);
    }
    private displayMinutes(ticks: number) {
        this.minutesDisplay = this.pad(Math.floor(this.timerValue / 60) % 60);
    }
    private pad(digit: any) {
        return digit <= 9 ? '0' + digit : digit;
    }
}
