import { Message } from '@common/message';
import { Service } from 'typedi';

@Service()
export class CountdownTimerService {
    private minutes: number;
    private seconds: number;
    private valueTimer: number = 0;

    // TODO : add admin inputs for both minutes and seconds
    constructor(secondsAdmin: number = 20, minutesAdmin: number = 0) {
        this.seconds = secondsAdmin;
        this.minutes = minutesAdmin;
        this.setValueTimer();
    }

    private checkBoundarySeconds() {
        if (this.seconds > 60) {
            const tempSeconds = this.seconds;
            this.seconds = tempSeconds % 60;
            this.minutes += tempSeconds / 60;
        }
    }

    private checkBoundaryMinutes() {
        if (this.minutes > 2) {
            this.minutes = 2;
            this.seconds = 0;
        }
    }

    private calculateTimeValue() {
        this.valueTimer = this.minutes * 60 + this.seconds;
    }

    private checkBoundaryTime() {
        if (this.valueTimer > 120) {
            this.valueTimer = 120;
            this.seconds = 0;
        }
    }

    private setValueTimer() {
        this.checkBoundarySeconds();
        this.checkBoundaryMinutes();
        this.calculateTimeValue();
        this.checkBoundaryTime();
    }

    sendTimerValue(): Message {
        return {
            title: 'Timervalue',
            body: this.valueTimer.toString(),
        };
    }
}
