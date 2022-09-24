import { BmpDecoder } from '@app/classes/bmp-decoder/bmp-decoder';
//import { BmpEncoder } from '@app/classes/bmp-encoder/bmp-encoder';
//import { Bmp } from '@app/classes/bmp/bmp';
import { Pixel } from '@app/interface/pixel';
import { expect } from 'chai';
import { describe } from 'mocha';
// import { BmpEncoder } from '@app/classes/bmp-encoder/bmp-encoder';
import { BmpDifference } from './bmp-difference';
describe(' DifferenceBetween2Images', () => {
    it('Should produce a white bmp if two images are similar', async () => {
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

        const bmpProduced = await BmpDifference.getDifference(filepath1, filepath2);

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
    it('Should throw an error if the height of the two images is not the same', async () => {
        const filePathOriginalBmp = './assets/test-bmp/bmp-test_2x3.bmp';
        const filePathModifiedBmp = './assets/test-bmp/bmp-test_2x2.bmp';
        try {
            const bmpProduced = await BmpDifference.getDifference(filePathOriginalBmp, filePathModifiedBmp);
            expect(bmpProduced).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });
    it('Should throw an error if the width of the two images is not the same', async () => {
        const filePathOriginalBmp = './assets/test-bmp/bmp-test_3x2.bmp';
        const filePathModifiedBmp = './assets/test-bmp/bmp-test_2x2.bmp';
        try {
            const bmpProduced = await BmpDifference.getDifference(filePathOriginalBmp, filePathModifiedBmp);
            expect(bmpProduced).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
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
        expect(BmpDifference.setPixelWhite(originalPixel)).to.eql(result);
    });
    it('transforming a random pixel into a black one', async () => {
        const result: Pixel = { a: 0, r: 0, g: 0, b: 0 };
        const originalPixel: Pixel = { a: 0, r: 128, g: 0, b: 128 };
        expect(BmpDifference.setPixelBlack(originalPixel)).to.eql(result);
    });
    it('Should produce a difference between two normal size images ', async () => {
        const filePathOriginalBmp = './assets/test-bmp/test_bmp_original.bmp';
        const filePathModifiedBmp = './assets/test-bmp/test_bmp_modified.bmp';
        const filePathExpectedBmp = './assets/test-bmp/test-expected-difference-0px.bmp';
        const difference = await BmpDifference.getDifference(filePathOriginalBmp, filePathModifiedBmp);
        const expectedDifference = await BmpDecoder.decode(filePathExpectedBmp);
        expect(difference).to.be.eql(expectedDifference);
    });
    // it('Should apply pixel enlargement for a given image ', async () => {
    //     const radius = 15;
    //     const filePathBmp = './assets/test-bmp/test-elargissement.bmp';
    //     const filePathOfTheResultBmp = './assets/test-bmp/test-elargissement-15px.bmp';
    //     const bmpImage = await BmpDecoder.decode(filePathBmp);
    //     const result: Bmp = BmpDifference.enlargePixelsArea(bmpImage, radius);
    //     BmpEncoder.encode(filePathOfTheResultBmp, result);
    // });
});
