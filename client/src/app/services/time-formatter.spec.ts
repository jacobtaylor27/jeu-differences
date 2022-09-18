import { TestBed } from '@angular/core/testing';
import { TimeFormatter } from './time-formatter';

describe('TimeFormatter', () => {
    let service: TimeFormatter;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TimeFormatter);
    });

    it("seconds should be converted into a time 'MM:SS'", () => {
        const basicFormat = '0:00';
        const basicEquivalent = 0;
        const edgeCase = '1:33';
        const edgeEquivalent = 93;

        expect(service.getMMSSFormat(basicEquivalent)).toEqual(basicFormat);
        expect(service.getMMSSFormat(edgeEquivalent)).toEqual(edgeCase);
    });

    it('a number of seconds negative should throw an exception', () => {
        const negativeTime = -1;
        expect(() => {
            service.getMMSSFormat(negativeTime);
        }).toThrow(new Error('time should always be positive'));
    });
});
