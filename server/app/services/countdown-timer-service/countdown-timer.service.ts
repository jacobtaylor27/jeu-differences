import { Message } from '@common/message';
import { Service } from 'typedi';

@Service()
export class CountdownTimerService {
    private minutes: number;
    private seconds: number;
    private valueTimer: number = 0;

    /* eslint-disable @typescript-eslint/no-magic-numbers -- 20 seconds set for the demo WILL BE REMOVED LATER */
    constructor(secondsAdmin: number = 20, minutesAdmin: number = 0) {
        this.seconds = secondsAdmin;
        this.minutes = minutesAdmin;
        this.setValueTimer();
    }

    sendTimerValue(): Message {
        return {
            title: 'Timervalue',
            body: this.valueTimer.toString(),
        };
    }

    private checkBoundarySeconds() {
        /* eslint-disable @typescript-eslint/no-magic-numbers -- 1 minute is 60 seconds */
        if (this.seconds > 60) {
            const tempSeconds = this.seconds;
            this.seconds = tempSeconds % 60;
            this.minutes += Math.floor(tempSeconds / 60);
        }
    }

    private checkBoundaryMinutes() {
        if (this.minutes > 2) {
            this.minutes = 2;
            this.seconds = 0;
        }
    }
    /* eslint-disable @typescript-eslint/no-magic-numbers -- 1 minute is 60 seconds */
    private calculateTimeValue() {
        this.valueTimer = this.minutes * 60 + this.seconds;
    }

    private checkBoundaryTime() {
        /* eslint-disable @typescript-eslint/no-magic-numbers -- 2 minutes is 120 seconds */
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
}
