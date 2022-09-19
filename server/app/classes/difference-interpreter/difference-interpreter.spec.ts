import { Bmp } from '@app/classes/bmp/bmp';
import { DifferenceInterpreter } from '@app/classes/difference-interpreter/difference-interpreter';
import { expect } from 'chai';
import { describe } from 'mocha';

describe('Difference interpreter', () => {
    it('Should throw an exception if given a bmp with pixels other than black or white', () => {
        // prettier-ignore
        // eslint-disable-next-line
        const rawData = [0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 254, 255, 255];
        const width = 2;
        const height = 2;
        const bmpWithColors = new Bmp(width, height, rawData);
        try {
            const difference = DifferenceInterpreter.getDifference(bmpWithColors);
            expect(difference).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });
    it("A white image shouldn't have any difference", () => {});
    it('A black image should have one difference', () => {});
    it('Black pixels side by side should be considered as one difference', () => {});
    it('Black pixels in diagonal should be considered as one difference', () => {});
});
