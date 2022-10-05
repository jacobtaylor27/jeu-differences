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
    private differenceFind: number = 0;

    constructor(private readonly timerService: TimerService) {
        timerService.differenceFind.subscribe(() => {
            this.differenceFind++;
        });
    }

    ngAfterViewInit(): void {
        this.startTimer();
    }

    ngOnDestroy(): void {
        // this.previousNbFound = 0;
        // this.previousNbFound = 0;
        // this.secondsTotal = 0;
        // this.penaltyTime = 0;
        this.timerService.resetNbDifferencesFound();
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

    // private setPreviousNbDifference(nb: number) {
    //     this.previousNbFound = nb;
    // }

    private calculateTime(seconds: number) {
        /* eslint-disable @typescript-eslint/no-magic-numbers -- fixed value for now but will change later on */
        this.secondsTotal = seconds - 5 * this.differenceFind;
    }
}
