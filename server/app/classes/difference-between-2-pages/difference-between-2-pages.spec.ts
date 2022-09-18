import { Pixel } from '@app/interface/pixel';
import { expect } from 'chai';
import { describe } from 'mocha';
import { DifferenceBetween2Images } from './difference-between-2-pages';

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
        const filepath1 = './assets/bmp_test_2x2.bmp';
        const filepath2 = './assets/bmp_test_2x2.bmp';

        const bmpProduced = await DifferenceBetween2Images.differenceBetween2Images(filepath1, filepath2);

        expect(bmpProduced.width).to.equals(expectedWidth);
        expect(bmpProduced.height).to.equals(expectedHeight);
        expect(bmpProduced.pixels).to.eql(pixelsExpected);
    });
    it('both images should have the same height', async () => {
        const result = false;
        const originalImageHeight = 3;
        const modifiedImageHeight = 2;
        expect(DifferenceBetween2Images.haveSameHeight(originalImageHeight, modifiedImageHeight)).to.equal(result);
    });
    it('both images should have the same Width', async () => {
        const result = false;
        const originalImageWidth = 3;
        const modifiedImageWidth = 2;
        expect(DifferenceBetween2Images.haveSameWidth(originalImageWidth, modifiedImageWidth)).to.equal(result);
    });
    it('Should create a Bmp object using the image path', async () => {
        const expectedWidth = 3;
        const expectedHeight = 2;
        const pixelsExpected = [
            [
                { a: 0, b: 0, g: 0, r: 255 },
                { a: 0, b: 255, g: 0, r: 0 },
                { a: 0, b: 128, g: 0, r: 128 },
            ],
            [
                { a: 0, b: 192, g: 192, r: 192 },
                { a: 0, b: 255, g: 255, r: 0 },
                { a: 0, b: 0, g: 255, r: 255 },
            ],
        ];
        const filepath = './assets/bmp_test_3x2.bmp';
        const bmpProduced = await DifferenceBetween2Images.produceImageBmp(filepath);
        expect(bmpProduced.width).to.equals(expectedWidth);
        expect(bmpProduced.height).to.equals(expectedHeight);
        expect(bmpProduced.pixels).to.eql(pixelsExpected);
    });
    it('verifying that 2 pixels have the same properties', async () => {
        const result = true;
        const originalPixel: Pixel = { a: 0, r: 255, g: 255, b: 255 };
        const modifiedPixel: Pixel = { a: 0, r: 255, g: 255, b: 255 };
        expect(DifferenceBetween2Images.equalPixels(originalPixel, modifiedPixel)).to.equal(result);
    });
    it('transforming a random pixel into a white one', async () => {
        const result: Pixel = { a: 0, r: 255, g: 255, b: 255 };
        const originalPixel: Pixel = { a: 0, r: 128, g: 0, b: 128 };
        expect(DifferenceBetween2Images.whitePixel(originalPixel)).to.eql(result);
    });
});
