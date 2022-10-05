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
    // private previousNbFound: number;
    // private penaltyTime: number;

    constructor(private readonly timerService: TimerService) {
        // this.previousNbFound = 0;
        // this.previousNbFound = 0;
        // this.penaltyTime = 0;
        //this.setPreviousNbDifference(0);
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

    private getNbOfDifferencesFound(): number {
        return this.timerService.nbOfDifferencesFound;
    }

    private startTimer() {
        /* eslint-disable @typescript-eslint/no-magic-numbers -- 1000 for 1second */
        const time = timer(1, 1000);
        this.sub = time.subscribe((seconds) => {
            console.log(this.secondsTotal);
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
        let penaltyTime;
        if (this.secondsTotal < this.getNbOfDifferencesFound() * 5) {
            penaltyTime = this.secondsTotal;
            return;
        } else {
            penaltyTime = 5 * this.getNbOfDifferencesFound();
        }
        this.secondsTotal = seconds - penaltyTime;
        /* eslint-disable @typescript-eslint/no-magic-numbers -- fixed value for now but will change later on */

        // this.penaltyTime = this.getNbOfDifferencesFound() * 5;

        // if (this.penaltyTime > this.secondsTotal && this.getNbOfDifferencesFound() > this.previousNbFound) {
        //     this.previousNbFound = this.getNbOfDifferencesFound();
        //     this.penaltyTime = this.secondsTotal;
        // } else if (this.getNbOfDifferencesFound() > this.previousNbFound) {
        //     this.previousNbFound = this.getNbOfDifferencesFound();
        //     this.penaltyTime += 5;
        // }

        // this.secondsTotal = seconds - this.penaltyTime;
    }
}
