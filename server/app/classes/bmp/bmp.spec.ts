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
        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            new Bmp(-1, 1, [0, 1, 2, 3]);
        }).to.throw(Error);
    });

    it('An exception should be throw if the height is less or equal to 0', () => {
        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            new Bmp(1, -1, [0, 1, 2, 3]);
        }).to.throw(Error);
    });

    it('The number of pixels should match the width, the height and the depth of the pixels', () => {
        expect(() => {
            new Bmp(1, 3, [0, 1, 2, 3, 0]);
        }).to.throw(Error);
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
