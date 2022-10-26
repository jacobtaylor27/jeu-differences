import {Component, Input, OnInit } from '@angular/core';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-timer-stopwatch',
    templateUrl: './timer-stopwatch.component.html',
    styleUrls: ['./timer-stopwatch.component.scss'],
})
export class TimerStopwatchComponent implements OnInit {
    @Input() clueAskedCounter: number;

    timerDisplay: string;

    // private secondsTotal: number;
    // private sub: Subscription;
    // private differenceFind: number = 0;

    constructor(private readonly socketService: CommunicationSocketService) {}
       
        // timerService.differenceFind.subscribe(() => {
        //     this.differenceFind++;
        //);

        // timerService.gameOver.subscribe(() => {
        //     this.stopTimer();
        // });
    ngOnInit(): void {
        this.socketService.on(SocketEvent.Clock, (time : string) =>{
            this.timerDisplay = time;
            console.log(time)
        })
    }

    // ngAfterViewInit(): void {
    //     this.startTimer();
    // }

    // ngOnDestroy(): void {
    //     this.timerService.resetNbDifferencesFound();
    //     this.stopTimer();
    // }

    // private startTimer() {
    //     /* eslint-disable @typescript-eslint/no-magic-numbers -- 1000 for 1second */
    //     const time = timer(1, 1000);
    //     this.sub = time.subscribe((seconds) => {
    //         this.calculateTime(seconds);
    //         this.timerDisplay = this.timerService.displayTime(this.secondsTotal);
    //     });
    // }

    // private stopTimer() {
    //     this.sub.unsubscribe();
    // }

    // // private setPreviousNbDifference(nb: number) {
    // //     this.previousNbFound = nb;
    // // }

    // private calculateTime(seconds: number) {
    //     /* eslint-disable @typescript-eslint/no-magic-numbers -- fixed value for now but will change later on */
    //     this.secondsTotal = seconds - 5 * this.differenceFind;
    // }
}
