import { Bmp } from '@app/classes/bmp/bmp';
import { PIXEL_BUFFER, TEST_BMP_DATA } from '@app/classes/bmp/bmp.spec.contants';
import { Pixel } from '@app/classes/pixel/pixel';
import * as bmp from 'bmp-js';
import { expect } from 'chai';
import { describe } from 'mocha';

describe('Bmp', () => {
    it('The constructor should construct an image based on the its parameters', () => {
        const pixelsExpected = [
            [
                { a: 255, r: 1, g: 2, b: 3 },
                { a: 255, r: 1, g: 2, b: 3 },
            ],
            [
                { a: 255, r: 1, g: 2, b: 3 },
                { a: 255, r: 1, g: 2, b: 3 },
            ],
        ];

        const bmpProduced = new Bmp(TEST_BMP_DATA.width, TEST_BMP_DATA.height, TEST_BMP_DATA.data);

        expect(bmpProduced.getWidth()).to.equals(TEST_BMP_DATA.width);
        expect(bmpProduced.getHeight()).to.equals(TEST_BMP_DATA.height);
        expect(bmpProduced.getPixels()).to.eql(pixelsExpected);
    });

    it('An exception should be thrown if the width is less or equal to 0', () => {
        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            new Bmp(-1, 1, [255, 1, 2, 3]);
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
        const bmpProduced = new Bmp(TEST_BMP_DATA.width, TEST_BMP_DATA.height, TEST_BMP_DATA.data);
        expect(await bmpProduced['getPixelBuffer']()).to.deep.equal(Buffer.from(PIXEL_BUFFER));
    });

    it('convertRawToPixels() should convert an array of numbers into pixels', async () => {
        const pixel: Pixel = new Pixel(1, 2, 3);
        const pixels: Pixel[][] = [
            [pixel, pixel],
            [pixel, pixel],
        ];
        const bmpObj = new Bmp(TEST_BMP_DATA.width, TEST_BMP_DATA.height, TEST_BMP_DATA.data);
        expect(bmpObj['convertRawToPixels'](TEST_BMP_DATA.data, TEST_BMP_DATA.width, TEST_BMP_DATA.height)).to.deep.equal(pixels);
    });

    it('toImageData() should convert the data from the bmp object into an ImageData format', async () => {
        const bmpObj = new Bmp(TEST_BMP_DATA.width, TEST_BMP_DATA.height, TEST_BMP_DATA.data);

        const colorSpace = 'srgb';
        const imageDataExpected: ImageData = {
            colorSpace,
            width: TEST_BMP_DATA.width,
            height: TEST_BMP_DATA.height,
            data: new Uint8ClampedArray(await bmpObj['getPixelBuffer']()),
        };
        expect(await bmpObj.toImageData()).to.deep.equal(imageDataExpected);
    });

    it('toBmpImageData() should convert the data from the bmp object into an bmp.ImageData format', async () => {
        const bmpObj = new Bmp(TEST_BMP_DATA.width, TEST_BMP_DATA.height, TEST_BMP_DATA.data);
        const imgData: bmp.ImageData = {
            width: TEST_BMP_DATA.width,
            height: TEST_BMP_DATA.height,
            data: await bmpObj['getPixelBuffer'](),
        };
        const encodedBmp = bmp.encode(imgData);
        expect(await bmpObj.toBmpImageData()).to.deep.equal(encodedBmp);
    });
});
