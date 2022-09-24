import { BmpDecoder } from '@app/classes/bmp-decoder/bmp-decoder';
import { Coordinates } from '@app/interface/coordinates';
import { Pixel } from '@app/interface/pixel';
import { expect } from 'chai';
import { describe } from 'mocha';
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
        const bmpProduced = await BmpDecoder.decode(filepath);
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
    it('Should return an array of coordinates with all the black pixels in a given image ', async () => {
        const filePathBmp = './assets/test-bmp/test-white-image-with-one-black-pixel.bmp';
        const expectedCoord: Coordinates[] = [{ x: 6, y: 6 }];
        const bmpImage = await BmpDecoder.decode(filePathBmp);
        const blackPixelsCoordinates: Coordinates[] = BmpDifference.getBlackPixelsFromOriginalImage(bmpImage);
        expect(blackPixelsCoordinates).to.be.eql(expectedCoord);
    });
    it('Should apply  3 pixel enlargement radius  for a given point ', async () => {
        const radius = 3;
        const center: Coordinates = { x: 5, y: 5 };
        const expectedCoord: Coordinates[] = [
            { x: 2, y: 5 },
            { x: 3, y: 3 },
            { x: 3, y: 4 },
            { x: 3, y: 5 },
            { x: 3, y: 6 },
            { x: 3, y: 7 },
            { x: 4, y: 3 },
            { x: 4, y: 4 },
            { x: 4, y: 5 },
            { x: 4, y: 6 },
            { x: 4, y: 7 },
            { x: 5, y: 2 },
            { x: 5, y: 3 },
            { x: 5, y: 4 },
            { x: 5, y: 5 },
            { x: 5, y: 6 },
            { x: 5, y: 7 },
            { x: 5, y: 8 },
            { x: 6, y: 3 },
            { x: 6, y: 4 },
            { x: 6, y: 5 },
            { x: 6, y: 6 },
            { x: 6, y: 7 },
            { x: 7, y: 3 },
            { x: 7, y: 4 },
            { x: 7, y: 5 },
            { x: 7, y: 6 },
            { x: 7, y: 7 },
            { x: 8, y: 5 },
        ];
        const result: Coordinates[] = BmpDifference.applyEnlargement(center, radius);
        expect(expectedCoord).to.be.eql(result);
    });
    it('Should apply  3 pixel enlargement radius  for a given array of Coordinates ', async () => {
        const radius = 3;
        const arrayCoord: Coordinates[] = [
            { x: 5, y: 5 },
            { x: 10, y: 10 },
        ];
        const expectedCoord = [
            { x: 2, y: 5 },
            { x: 3, y: 3 },
            { x: 3, y: 4 },
            { x: 3, y: 5 },
            { x: 3, y: 6 },
            { x: 3, y: 7 },
            { x: 4, y: 3 },
            { x: 4, y: 4 },
            { x: 4, y: 5 },
            { x: 4, y: 6 },
            { x: 4, y: 7 },
            { x: 5, y: 2 },
            { x: 5, y: 3 },
            { x: 5, y: 4 },
            { x: 5, y: 5 },
            { x: 5, y: 6 },
            { x: 5, y: 7 },
            { x: 5, y: 8 },
            { x: 6, y: 3 },
            { x: 6, y: 4 },
            { x: 6, y: 5 },
            { x: 6, y: 6 },
            { x: 6, y: 7 },
            { x: 7, y: 3 },
            { x: 7, y: 4 },
            { x: 7, y: 5 },
            { x: 7, y: 6 },
            { x: 7, y: 7 },
            { x: 8, y: 5 },
            { x: 7, y: 10 },
            { x: 8, y: 8 },
            { x: 8, y: 9 },
            { x: 8, y: 10 },
            { x: 8, y: 11 },
            { x: 8, y: 12 },
            { x: 9, y: 8 },
            { x: 9, y: 9 },
            { x: 9, y: 10 },
            { x: 9, y: 11 },
            { x: 9, y: 12 },
            { x: 10, y: 7 },
            { x: 10, y: 8 },
            { x: 10, y: 9 },
            { x: 10, y: 10 },
            { x: 10, y: 11 },
            { x: 10, y: 12 },
            { x: 10, y: 13 },
            { x: 11, y: 8 },
            { x: 11, y: 9 },
            { x: 11, y: 10 },
            { x: 11, y: 11 },
            { x: 11, y: 12 },
            { x: 12, y: 8 },
            { x: 12, y: 9 },
            { x: 12, y: 10 },
            { x: 12, y: 11 },
            { x: 12, y: 12 },
            { x: 13, y: 10 },
        ];
        const result: Coordinates[] = BmpDifference.getCoordinatesAfterEnlargement(arrayCoord, radius);
        expect(expectedCoord).to.be.eql(result);
    });
    it('Should apply  3 pixel enlargement radius  for a given image ', async () => {
        const radius = 3;
        const filePathBmp = './assets/test-bmp/test-expected-difference-0px.bmp';
        const filePathOfTheResultBmp = './assets/test-bmp/test-expected-difference-3px.bmp';
        const expectedBmpImage = await BmpDecoder.decode(filePathOfTheResultBmp);
        const originalBmp = await BmpDecoder.decode(filePathBmp);
        expect(expectedBmpImage).to.be.eql(BmpDifference.enlargePixelsArea(originalBmp, radius));
    });
    it('Should apply  9 pixel enlargement radius  for a given image ', async () => {
        const radius = 9;
        const filePathBmp = './assets/test-bmp/test-expected-difference-0px.bmp';
        const filePathOfTheResultBmp = './assets/test-bmp/test-expected-difference-9px.bmp';
        const expectedBmpImage = await BmpDecoder.decode(filePathOfTheResultBmp);
        const originalBmp = await BmpDecoder.decode(filePathBmp);
        expect(expectedBmpImage).to.be.eql(BmpDifference.enlargePixelsArea(originalBmp, radius));
    });
    it('Should apply  15 pixel enlargement radius  for a given image ', async () => {
        const radius = 15;
        const filePathBmp = './assets/test-bmp/test-expected-difference-0px.bmp';
        const filePathOfTheResultBmp = './assets/test-bmp/test-expected-difference-15px.bmp';
        const expectedBmpImage = await BmpDecoder.decode(filePathOfTheResultBmp);
        const originalBmp = await BmpDecoder.decode(filePathBmp);
        expect(expectedBmpImage).to.be.eql(BmpDifference.enlargePixelsArea(originalBmp, radius));
    });
});
