import { Component, Input, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { TimerService } from '../../services/timer.service';

@Component({
    selector: 'app-timer-stopwatch',
    templateUrl: './timer-stopwatch.component.html',
    styleUrls: ['./timer-stopwatch.component.scss'],
})
export class TimerStopwatchComponent implements OnInit {
    @Input() clueAskedCounter: number;

    timerDisplay: string;

    private secondsTotal: number;
    private sub: Subscription;

    constructor(private readonly timerService: TimerService) {}

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
            this.timerDisplay = this.timerService.displayTime(this.secondsTotal);
        });
    }

    private stopTimer() {
        this.sub.unsubscribe();
    }

    private calculateTime(seconds: number) {
        this.secondsTotal = seconds + this.clueAskedCounter * 5;
    }
}
