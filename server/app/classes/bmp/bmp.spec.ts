import { Buffer } from 'buffer';
import { expect } from 'chai';
import { describe } from 'mocha';
import { Bmp } from './bmp';

describe('Bmp', () => {
    it('The constructor should construct an image based on the its parameters', () => {
        const expectedWidth = 2;
        const expectedHeight = 2;
        const rawData = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3];

        const pixelsExpected = [
            [
                { a: 0, r: 1, g: 2, b: 3 },
                { a: 0, r: 1, g: 2, b: 3 },
            ],
            [
                { a: 0, r: 1, g: 2, b: 3 },
                { a: 0, r: 1, g: 2, b: 3 },
            ],
        ];

        const bmpProduced = new Bmp(expectedWidth, expectedHeight, rawData);

        expect(bmpProduced.getWidth()).to.equals(expectedWidth);
        expect(bmpProduced.getHeight()).to.equals(expectedHeight);
        expect(bmpProduced.getPixels()).to.eql(pixelsExpected);
    });

    it('An exception should be thrown if the width is less or equal to 0', () => {
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

    it('An exception should be throw if the height is less or equal to 0', () => {
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

        const invalidRawData = [0, 1, 2, 3, 0];

        try {
            const bmpProduced = new Bmp(validWidth, validHeight, invalidRawData);
            expect(bmpProduced).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });

    it('toBuffer() should convert a bmp file into a buffer', async () => {
        const expectedWidth = 2;
        const expectedHeight = 2;
        const rawData = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3];
        const expectedBuffer: Buffer = Buffer.from(rawData);
        const bmpProduced = new Bmp(expectedWidth, expectedHeight, rawData);

        expect(await bmpProduced.toBuffer()).to.deep.equal(expectedBuffer);
    });
});
