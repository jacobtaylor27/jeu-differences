import { TestBed } from '@angular/core/testing';
import { TimeFormatter } from './time-formatter';

describe('TimeFormatter', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TimeFormatter],
        }).compileComponents();
    });

    it("seconds should be converted into a time 'MM:SS'", () => {
        const basicFormat = '0:00';
        const basicEquivalent = 0;
        const edgeCase = '1:33';
        const edgeEquivalent = 93;
        expect(TimeFormatter.getMMSSFormat(basicEquivalent)).toEqual(basicFormat);
        expect(TimeFormatter.getMMSSFormat(edgeEquivalent)).toEqual(edgeCase);
    });

    it('a number of seconds negative should throw an exception', () => {
        const negativeTime = -1;
        expect(() => {
            TimeFormatter.getMMSSFormat(negativeTime);
        }).toThrow(new Error('time should always be positive'));
    });
});
