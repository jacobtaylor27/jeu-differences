import { Bmp } from '@app/classes/bmp/bmp';
import { EQUIVALENT_DATA, PIXEL_BUFFER_ARGB, TEST_BMP_DATA } from '@app/classes/bmp/bmp.spec.contants';
import { Pixel } from '@app/classes/pixel/pixel';
import * as bmp from 'bmp-js';
import { expect } from 'chai';
import { describe } from 'mocha';

describe('Bmp', () => {
    it('The constructor should construct an image based on the its parameters', () => {
        const bmpProduced = new Bmp({ width: TEST_BMP_DATA[0].width, height: TEST_BMP_DATA[0].height }, TEST_BMP_DATA[0].data);
        expect(bmpProduced.getWidth()).to.equals(TEST_BMP_DATA[0].width);
        expect(bmpProduced.getHeight()).to.equals(TEST_BMP_DATA[0].height);
        expect(bmpProduced.getPixels()).to.eql(EQUIVALENT_DATA);
    });

    it('An exception should be thrown if the width is less or equal to 0', () => {
        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            new Bmp({ width: -1, height: 1 }, [255, 1, 2, 3]);
        }).to.throw(Error);
    });

    it('An exception should be throw if the height is less or equal to 0', () => {
        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            new Bmp({ width: 1, height: -1 }, [255, 1, 2, 3]);
        }).to.throw(Error);
    });

    it('The number of pixels should match the width, the height and the depth of the pixels', () => {
        expect(() => {
            new Bmp({ width: 1, height: 3 }, [0, 1, 2, 3, 0]);
        }).to.throw(RangeError);
    });

    it('toBuffer() should convert a bmp file into a buffer', async () => {
        const bmpProduced = new Bmp({ width: TEST_BMP_DATA[0].width, height: TEST_BMP_DATA[0].height }, TEST_BMP_DATA[0].data);
        expect(await bmpProduced['getPixelBuffer']()).to.deep.equal(Buffer.from(PIXEL_BUFFER_ARGB));
    });

    it('convertRawToPixels() should convert an array of numbers into pixels', async () => {
        const pixel: Pixel = new Pixel(1, 2, 3);
        const pixels: Pixel[][] = [
            [pixel, pixel],
            [pixel, pixel],
        ];
        const bmpObj = new Bmp({ width: TEST_BMP_DATA[0].width, height: TEST_BMP_DATA[0].height }, TEST_BMP_DATA[0].data);
        expect(bmpObj['convertRawToPixels'](TEST_BMP_DATA[0].data, { width: TEST_BMP_DATA[0].width, height: TEST_BMP_DATA[0].height })).to.deep.equal(
            pixels,
        );
    });

    it('convertRawToPixels() should work with different pixels', async () => {
        const pixels: Pixel[][] = [
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            [new Pixel(1, 2, 3), new Pixel(2, 3, 4)],
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            [new Pixel(3, 4, 5), new Pixel(4, 5, 6)],
        ];
        const bmpObj = new Bmp({ width: TEST_BMP_DATA[1].width, height: TEST_BMP_DATA[1].height }, TEST_BMP_DATA[1].data);
        expect(bmpObj['convertRawToPixels'](TEST_BMP_DATA[1].data, { width: TEST_BMP_DATA[1].width, height: TEST_BMP_DATA[1].height })).to.deep.equal(
            pixels,
        );
    });

    it('convertRawToPixels() should work with different size of arrays', async () => {
        const pixels: Pixel[][] = [
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            [new Pixel(1, 2, 3), new Pixel(2, 3, 4)],
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            [new Pixel(3, 4, 5), new Pixel(4, 5, 6)],
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            [new Pixel(5, 6, 7), new Pixel(6, 7, 8)],
        ];
        const bmpObj = new Bmp({ width: TEST_BMP_DATA[2].width, height: TEST_BMP_DATA[2].height }, TEST_BMP_DATA[2].data);
        expect(bmpObj['convertRawToPixels'](TEST_BMP_DATA[2].data, { width: TEST_BMP_DATA[2].width, height: TEST_BMP_DATA[2].height })).to.deep.equal(
            pixels,
        );
    });

    it('toImageData() should convert the data from the bmp object into an ImageData format', async () => {
        const bmpObj = new Bmp({ width: TEST_BMP_DATA[0].width, height: TEST_BMP_DATA[0].height }, TEST_BMP_DATA[0].data);

        const colorSpace = 'srgb';
        const imageDataExpected: ImageData = {
            colorSpace,
            width: TEST_BMP_DATA[0].width,
            height: TEST_BMP_DATA[0].height,
            data: new Uint8ClampedArray(Buffer.from(Pixel.convertPixelsToBGRA(bmpObj.getPixels()))),
        };
        expect(await bmpObj.toImageData()).to.deep.equal(imageDataExpected);
    });

    it('toBmpImageData() should convert the data from the bmp object into an bmp.ImageData format', async () => {
        const bmpObj = new Bmp({ width: TEST_BMP_DATA[0].width, height: TEST_BMP_DATA[0].height }, TEST_BMP_DATA[0].data);
        const imgData: bmp.ImageData = {
            width: TEST_BMP_DATA[0].width,
            height: TEST_BMP_DATA[0].height,
            data: await bmpObj['getPixelBuffer'](),
        };
        const encodedBmp = bmp.encode(imgData);
        expect(await bmpObj.toBmpImageData()).to.deep.equal(encodedBmp);
    });
});
