import { Pixel } from '@app/interface/pixel';
import { expect } from 'chai';
import { describe } from 'mocha';
import { BmpDifference } from './bmp-difference';

describe(' DifferenceBetween2Images', () => {
    it('Should transform the second image to the result of the difference between the first and the second', async () => {
        const expectedWidth = 2;
        const expectedHeight = 2;
        const pixelsExpected = [
            [
                { a: 0, r: 255, g: 255, b: 255 },
                { a: 0, r: 255, g: 255, b: 255 },
            ],
            [
                { a: 0, r: 255, g: 255, b: 255 },
                { a: 0, r: 255, g: 255, b: 255 },
            ],
        ];
        const filepath1 = './assets/test-bmp/bmp_test_2x2.bmp';
        const filepath2 = './assets/test-bmp/bmp_test_2x2.bmp';

        const bmpProduced = await BmpDifference.bmpDifference(filepath1, filepath2);

        expect(bmpProduced.getWidth()).to.equals(expectedWidth);
        expect(bmpProduced.getHeight()).to.equals(expectedHeight);
        expect(bmpProduced.getPixels()).to.eql(pixelsExpected);
    });
    it('both images should have the same height', async () => {
        const result = false;
        const originalImageHeight = 3;
        const modifiedImageHeight = 2;
        expect(BmpDifference.isHeightEqual(originalImageHeight, modifiedImageHeight)).to.equal(result);
    });
    it('both images should have the same Width', async () => {
        const result = false;
        const originalImageWidth = 3;
        const modifiedImageWidth = 2;
        expect(BmpDifference.isWidthEqual(originalImageWidth, modifiedImageWidth)).to.equal(result);
    });
    it('Should create a Bmp object using the image path', async () => {
        const expectedWidth = 3;
        const expectedHeight = 2;
        const pixelsExpected = [
            [
                { a: 0, b: 255, g: 0, r: 0 },
                { a: 0, b: 0, g: 0, r: 255 },
                { a: 0, b: 128, g: 0, r: 128 },
            ],
            [
                { a: 0, b: 192, g: 192, r: 192 },
                { a: 0, b: 0, g: 255, r: 255 },
                { a: 0, b: 255, g: 255, r: 0 },
            ],
        ];
        const filepath = './assets/test-bmp/bmp_test_3x2.bmp';
        const bmpProduced = await BmpDifference.produceImageBmp(filepath);
        expect(bmpProduced.getWidth()).to.equals(expectedWidth);
        expect(bmpProduced.getHeight()).to.equals(expectedHeight);
        expect(bmpProduced.getPixels()).to.eql(pixelsExpected);
    });
    it('verifying that 2 pixels have the same properties', async () => {
        const result = true;
        const originalPixel: Pixel = { a: 0, r: 255, g: 255, b: 255 };
        const modifiedPixel: Pixel = { a: 0, r: 255, g: 255, b: 255 };
        expect(BmpDifference.arePixelsEqual(originalPixel, modifiedPixel)).to.equal(result);
    });
    it('transforming a random pixel into a white one', async () => {
        const result: Pixel = { a: 0, r: 255, g: 255, b: 255 };
        const originalPixel: Pixel = { a: 0, r: 128, g: 0, b: 128 };
        expect(BmpDifference.whitePixel(originalPixel)).to.eql(result);
    });
});
