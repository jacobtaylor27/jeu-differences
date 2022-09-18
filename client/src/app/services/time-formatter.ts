import { Injectable } from '@angular/core';
import { MINUTES_IN_AN_HOUR, SECONDS_IN_AN_MINUTE } from '@app/constants/time';

@Injectable({
    providedIn: 'root',
})
export class TimeFormatter {
    getMMSSFormat(second: number): string {
        if (second < 0) {
            throw new Error('time should always be positive');
        }

        const DEFAULT_PRECISION = 2;
        const minutes: string = Math.floor(second / MINUTES_IN_AN_HOUR).toString();
        const seconds: string = (second % SECONDS_IN_AN_MINUTE).toString();
        return `${minutes}:${seconds.padStart(DEFAULT_PRECISION, '0')}`;
    }
}
