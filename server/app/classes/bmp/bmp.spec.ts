import { Bmp } from '@app/classes/bmp/bmp';
import { Pixel } from '@app/classes/pixel/pixel';
import * as bmp from 'bmp-js';
import { Buffer } from 'buffer';
import { expect } from 'chai';
import { describe } from 'mocha';

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
        }).to.throw(RangeError);
    });

    it('toBuffer() should convert a bmp file into a buffer', async () => {
        const expectedWidth = 2;
        const expectedHeight = 2;
        const rawData = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3];
        const expectedBuffer: Buffer = Buffer.from(rawData);
        const bmpProduced = new Bmp(expectedWidth, expectedHeight, rawData);

        expect(await bmpProduced['getPixelBuffer']()).to.deep.equal(expectedBuffer);
    });

    it('convertRawToPixels() should convert an array of numbers into pixels', async () => {
        const width = 2;
        const height = 2;
        const rawData = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3];
        const pixel: Pixel = new Pixel(1, 2, 3);
        const pixels: Pixel[][] = [
            [pixel, pixel],
            [pixel, pixel],
        ];
        const bmpObj = new Bmp(width, height, rawData);
        expect(bmpObj['convertRawToPixels'](rawData, width, height)).to.deep.equal(pixels);
    });

    it('toImageData() should convert the data from the bmp object into an ImageData format', async () => {
        const width = 2;
        const height = 2;
        const defaultRawData = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3];
        const bmpObj = new Bmp(width, height, defaultRawData);

        const data = new Uint8ClampedArray(await bmpObj['getPixelBuffer']());

        const colorSpace = 'srgb';
        const imageDataExpected: ImageData = {
            colorSpace,
            width,
            height,
            data,
        };
        expect(await bmpObj.toImageData()).to.deep.equal(imageDataExpected);
    });

    it('toBmpImageData() should convert the data from the bmp object into an bmp.ImageData format', async () => {
        const width = 2;
        const height = 2;
        const defaultRawData = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3];
        const bmpObj = new Bmp(width, height, defaultRawData);
        const data = await bmpObj['getPixelBuffer']();
        const imgData: bmp.ImageData = {
            width,
            height,
            data,
        };
        const encodedBmp = bmp.encode(imgData);
        expect(await bmpObj.toBmpImageData()).to.deep.equal(encodedBmp);
    });
});
