import { MINUTES_IN_AN_HOUR, SECONDS_IN_AN_MINUTE } from '@app/constants/time';

export class TimeFormatter {
    static getMMSSFormat(timeInSeconds: number, precision: number): string {
        const minutes: string = Math.floor(timeInSeconds / MINUTES_IN_AN_HOUR).toString();
        const seconds: string = (timeInSeconds % SECONDS_IN_AN_MINUTE).toString();
        return `${minutes}:${seconds.padStart(precision, '0')}`;
    }
}
