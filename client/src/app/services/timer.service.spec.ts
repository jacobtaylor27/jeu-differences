import { TestBed } from '@angular/core/testing';

import { TimerService } from './timer.service';

describe('TimerService', () => {
    let service: TimerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TimerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should display time with format mm : ss', () => {
        let timeSeconds = 65;
        let timeDisplayExpected = '01 : 05';
        expect(service.displayTime(timeSeconds)).toEqual(timeDisplayExpected);
        timeSeconds = 1;
        timeDisplayExpected = '00 : 01';
        expect(service.displayTime(timeSeconds)).toEqual(timeDisplayExpected);
    });
});
