import { expect } from 'chai';
import { describe } from 'mocha';
import { Bmp } from './bmp';

describe('Bmp', () => {
    it('The constructor should construct an image based on the its parameters', () => {
        const expectedWidth = 2;
        const expectedHeight = 2;
        // TODO: What am I suppose to do with magic numbers?
        const rawData = [0, 1, 2, 3, 0, 3, 4, 5, 0, 6, 7, 8, 0, 9, 1, 0];

        const pixelsExpected = [
            [
                { a: 0, b: 1, g: 2, r: 3 },
                { a: 0, b: 3, g: 4, r: 5 },
            ],
            [
                { a: 0, b: 6, g: 7, r: 8 },
                { a: 0, b: 9, g: 1, r: 0 },
            ],
        ];

        const bmpProduced = new Bmp(expectedWidth, expectedHeight, rawData);

        expect(bmpProduced.width).to.equals(expectedWidth);
        expect(bmpProduced.height).to.equals(expectedHeight);
        expect(bmpProduced.pixels).to.eql(pixelsExpected);
    });

    it('An exception should be thrown if the width is less of equal to 0', () => {
        const invalidWidth = -1;
        const validHeight = 1;
        const validDataRow = [0, 1, 2, 3];

        try {
            const bmpProduced = new Bmp(invalidWidth, validHeight, validDataRow);
            expect(bmpProduced).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });

    it('An exception should be throw if the height is less of equal to 0', () => {
        const validWidth = 1;
        const invalidHeight = -1;
        const validDataRow = [0, 1, 2, 3];

        try {
            const bmpProduced = new Bmp(validWidth, invalidHeight, validDataRow);
            expect(bmpProduced).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });

    it('The number of pixels should match the width, the height and the depth of the pixels', () => {
        const validWidth = 1;
        const validHeight = 3;
        const invalidRawData = [0, 1, 2, 3, 4];

        try {
            const bmpProduced = new Bmp(validWidth, validHeight, invalidRawData);
            expect(bmpProduced).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });
});
