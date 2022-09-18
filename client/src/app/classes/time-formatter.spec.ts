import { TestBed } from '@angular/core/testing';
import { TimeFormatter } from './time-formatter';

describe('TimeFormatter', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TimeFormatter],
        }).compileComponents();
    });

    it("seconds should be converted into a time  'MM:SS'", () => {
        const expectedFormatedTime = '0:00';
        expect(TimeFormatter.getMMSSFormat(0)).toEqual(expectedFormatedTime);
    });

    it('a number of seconds negative should throw an exception', () => {
        const negativeTime = -1;
        expect(() => {
            TimeFormatter.getMMSSFormat(negativeTime);
        }).toThrow(new Error('time should always be positive'));
    });
});
