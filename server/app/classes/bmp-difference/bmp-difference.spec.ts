import { BmpDecoder } from '@app/classes/bmp-decoder/bmp-decoder';
// import { Coordinates } from '@app/interface/coordinates';
// import { Pixel } from '@app/interface/pixel';
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
        const radius = 0;

        const bmpProduced = await BmpDifference.getDifference(filepath1, filepath2, radius);

        expect(bmpProduced.getWidth()).to.equals(expectedWidth);
        expect(bmpProduced.getHeight()).to.equals(expectedHeight);
        expect(bmpProduced.getPixels()).to.eql(pixelsExpected);
    });
    it('Should throw an error if the height of the two images is not the same', async () => {
        const filePathOriginalBmp = './assets/test-bmp/bmp-test_2x3.bmp';
        const filePathModifiedBmp = './assets/test-bmp/bmp-test_2x2.bmp';
        const radius = 0;
        try {
            const bmpProduced = await BmpDifference.getDifference(filePathOriginalBmp, filePathModifiedBmp, radius);
            expect(bmpProduced).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });
    it('Should throw an error if the width of the two images is not the same', async () => {
        const filePathOriginalBmp = './assets/test-bmp/bmp-test_3x2.bmp';
        const filePathModifiedBmp = './assets/test-bmp/bmp-test_2x2.bmp';
        const radius = 0;
        try {
            const bmpProduced = await BmpDifference.getDifference(filePathOriginalBmp, filePathModifiedBmp, radius);
            expect(bmpProduced).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });
    it('Should throw an error if the original path is not valid', async () => {
        const invalidPath = '';
        const filePathModifiedBmp = './assets/test-bmp/bmp-test_2x2.bmp';
        const radius = 0;
        try {
            const bmpProduced = await BmpDifference.getDifference(invalidPath, filePathModifiedBmp, radius);
            expect(bmpProduced).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });
    it('Should throw an error if the modified path is not valid', async () => {
        const filePathOriginalBmp = './assets/test-bmp/bmp-test_2x2.bmp';
        const invalidPath = '';
        const radius = 0;
        try {
            const bmpProduced = await BmpDifference.getDifference(filePathOriginalBmp, invalidPath, radius);
            expect(bmpProduced).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });
    it('Should throw an error if the file is not a bitmap', async () => {
        const filePathOriginalBmp = './assets/test-bmp/bmp-test_2x2.bmp';
        const filepath = './assets/test-bmp/jpg_test.jpg';
        const radius = 0;
        try {
            const bmpProduced = await BmpDifference.getDifference(filePathOriginalBmp, filepath, radius);
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
    it('verifying that the value of radius is greater or equal to zero', async () => {
        const filePathOriginalBmp = './assets/test-bmp/bmp-test_2x2.bmp';
        const filePathModifiedBmp = './assets/test-bmp/bmp-test_2x2.bmp';
        const radius = -1;
        try {
            const bmpProduced = await BmpDifference.getDifference(filePathOriginalBmp, filePathModifiedBmp, radius);
            expect(bmpProduced).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });
    it('Should produce a difference between two normal size images ', async () => {
        const filePathOriginalBmp = './assets/test-bmp/test_bmp_original.bmp';
        const filePathModifiedBmp = './assets/test-bmp/test_bmp_modified.bmp';
        const radius = 0;
        const filePathExpectedBmp = './assets/test-bmp/test-expected-difference-0px.bmp';
        const difference = await BmpDifference.getDifference(filePathOriginalBmp, filePathModifiedBmp, radius);
        const expectedDifference = await BmpDecoder.decode(filePathExpectedBmp);
        expect(difference).to.be.eql(expectedDifference);
    });
    it('Should apply  3 pixel enlargement radius  for a given image ', async () => {
        const filePathOriginalBmp = './assets/test-bmp/test_bmp_original.bmp';
        const filePathModifiedBmp = './assets/test-bmp/test_bmp_modified.bmp';
        const radius = 3;
        const filePathOfTheResultBmp = './assets/test-bmp/test-expected-difference-3px.bmp';
        const expectedBmpImage = await BmpDecoder.decode(filePathOfTheResultBmp);
        expect(expectedBmpImage).to.be.eql(await BmpDifference.getDifference(filePathOriginalBmp, filePathModifiedBmp, radius));
    });
    it('Should apply  9 pixel enlargement radius  for a given image ', async () => {
        const filePathOriginalBmp = './assets/test-bmp/test_bmp_original.bmp';
        const filePathModifiedBmp = './assets/test-bmp/test_bmp_modified.bmp';
        const radius = 9;
        const filePathOfTheResultBmp = './assets/test-bmp/test-expected-difference-9px.bmp';
        const expectedBmpImage = await BmpDecoder.decode(filePathOfTheResultBmp);
        expect(expectedBmpImage).to.be.eql(await BmpDifference.getDifference(filePathOriginalBmp, filePathModifiedBmp, radius));
    });
    it('Should apply  15 pixel enlargement radius  for a given image ', async () => {
        const filePathOriginalBmp = './assets/test-bmp/test_bmp_original.bmp';
        const filePathModifiedBmp = './assets/test-bmp/test_bmp_modified.bmp';
        const radius = 15;
        const filePathOfTheResultBmp = './assets/test-bmp/test-expected-difference-15px.bmp';
        const expectedBmpImage = await BmpDecoder.decode(filePathOfTheResultBmp);
        expect(expectedBmpImage).to.be.eql(await BmpDifference.getDifference(filePathOriginalBmp, filePathModifiedBmp, radius));
    });
});
