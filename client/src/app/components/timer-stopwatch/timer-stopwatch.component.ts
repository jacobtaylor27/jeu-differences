import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { TimerService } from '@app/services/timer.service';
import { Subscription, timer } from 'rxjs';

@Component({
    selector: 'app-timer-stopwatch',
    templateUrl: './timer-stopwatch.component.html',
    styleUrls: ['./timer-stopwatch.component.scss'],
})
export class TimerStopwatchComponent implements AfterViewInit, OnDestroy {
    @Input() clueAskedCounter: number;

    timerDisplay: string;

    private secondsTotal: number;
    private sub: Subscription;

    constructor(private readonly timerService: TimerService) {}

    ngAfterViewInit(): void {
        this.startTimer();
    }

    ngOnDestroy(): void {
        this.stopTimer();
    }

    private startTimer() {
        /* eslint-disable @typescript-eslint/no-magic-numbers -- 1000 for 1second */
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
        /* eslint-disable @typescript-eslint/no-magic-numbers -- fixed value for now but will change later on */
        this.secondsTotal = seconds + this.clueAskedCounter * 5;
    }
}
