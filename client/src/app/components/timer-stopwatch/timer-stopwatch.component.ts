import { Component, OnInit } from '@angular/core';
import { TimeFormatter } from '@app/classes/time-formatter';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-timer-stopwatch',
    templateUrl: './timer-stopwatch.component.html',
    styleUrls: ['./timer-stopwatch.component.scss'],
})
export class TimerStopwatchComponent implements OnInit {
    timerDisplay: string;

    constructor(private readonly socketService: CommunicationSocketService) {}

    ngOnInit(): void {
        this.socketService.on(SocketEvent.Clock, (time: number) => {
            this.timerDisplay = TimeFormatter.getMMSSFormat(time);
        });
    }
}
