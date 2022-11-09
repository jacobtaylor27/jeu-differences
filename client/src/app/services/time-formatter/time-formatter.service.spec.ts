import { TestBed } from '@angular/core/testing';

import { TimeFormatterService } from './time-formatter.service';

describe('TimeFormatterService', () => {
    let service: TimeFormatterService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TimeFormatterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should format seconds into a string with the MM::SS format', () => {
        const seconds = 60;
        const expected = '01:00';
        const actual = service.formatTime(seconds);
        expect(actual).toEqual(expected);
    });
});
