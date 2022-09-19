import { Bmp } from '@app/classes/bmp/bmp';
import { DifferenceInterpreter } from '@app/classes/difference-interpreter/difference-interpreter';
import { Difference } from '@app/classes/difference/difference';
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
    it("A white image shouldn't have any difference", () => {
        // prettier-ignore
        // eslint-disable-next-line
        const rawData = [0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255];
        const width = 2;
        const height = 2;
        const bmpWithColors = new Bmp(width, height, rawData);
        const nbOfDifference = 0;

        const difference: Difference[][] = DifferenceInterpreter.getDifference(bmpWithColors);
        expect(difference.length).to.equal(nbOfDifference);
    });
    it('A black image should have one difference', () => {
        // prettier-ignore
        // eslint-disable-next-line
        const rawData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const width = 2;
        const height = 2;
        const bmpWithColors = new Bmp(width, height, rawData);
        const nbOfDifference = 1;

        const difference: Difference[][] = DifferenceInterpreter.getDifference(bmpWithColors);
        expect(difference.length).to.equal(nbOfDifference);
    });
    it('Black pixels side by side should be considered as one difference', () => {});
    it('Black pixels in diagonal should be considered as one difference', () => {});
});
