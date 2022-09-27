import { Bmp } from '@app/classes/bmp/bmp';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
// import { Coordinates } from '@app/interface/coordinates';
import { Coordinates } from '@app/interface/coordinates';
import { expect } from 'chai';
import { describe } from 'mocha';
import { BmpSubtractorService } from './bmp-subtractor.service';

describe('DifferenceBetween2Images', async () => {
    let bmpDecoderService: BmpDecoderService;
    let bmpSubtractorService: BmpSubtractorService;

    let bmp2x2: Bmp;
    let bmp2x3: Bmp;

    beforeEach(async () => {
        bmpDecoderService = new BmpDecoderService();
        bmpSubtractorService = new BmpSubtractorService();

        bmp2x2 = await bmpDecoderService.decodeIntoBmp('./assets/test-bmp/bmp_test_2x2.bmp');
        bmp2x3 = await bmpDecoderService.decodeIntoBmp('./assets/test-bmp/bmp_test_2x3.bmp');
    });

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
        const radius = 0;

        const bmpProduced = await bmpSubtractorService.getDifferenceBMP(bmp2x2, bmp2x2, radius);

        expect(bmpProduced.getWidth()).to.equals(expectedWidth);
        expect(bmpProduced.getHeight()).to.equals(expectedHeight);
        expect(bmpProduced.getPixels()).to.eql(pixelsExpected);
    });

    it('Should throw an error if the height of the two images is not the same', async () => {
        const radius = 0;

        try {
            const bmpProduced = await bmpSubtractorService.getDifferenceBMP(bmp2x2, bmp2x3, radius);
            expect(bmpProduced).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });

    it('Should throw an error if the width of the two images is not the same', async () => {
        const radius = 0;
        try {
            const bmpProduced = await bmpSubtractorService.getDifferenceBMP(bmp2x3, bmp2x2, radius);
            expect(bmpProduced).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });

    it('verifying that the value of radius is greater or equal to zero', async () => {
        const radius = -1;

        try {
            const bmpProduced = await bmpSubtractorService.getDifferenceBMP(bmp2x2, bmp2x2, radius);
            expect(bmpProduced).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });

    it('Should return center value if radius is 0', () => {
        const radius = 0;
        const center: Coordinates = { x: 1, y: 1 };
        const result = bmpSubtractorService['findContourEnlargement'](center, radius);
        const expected: Coordinates[] = new Array();
        expected.push(center);
        expect(result.length).to.equal(expected.length);
        expect(result[0]).to.equal(expected[0]);
    });

    it('Should return array of coordinates of length bigger than 1 if radius > 0', () => {
        const radius = 3;
        const center: Coordinates = { x: 1, y: 1 };
        const result = bmpSubtractorService['findContourEnlargement'](center, radius);
        expect(result.length).to.greaterThan(1);
    });

    it('Should apply 0 pixel enlargement radius for a given image ', async () => {
        const radius = 0;
        const bmpWithRadiusOf0px = await bmpDecoderService.decodeIntoBmp('./assets/test-bmp/test-radius/dot-with-radius-0px.bmp');
        const blackBmp = await bmpDecoderService.decodeIntoBmp('./assets/test-bmp/test-radius/no-dot-with-no-radius.bmp');
        expect(bmpWithRadiusOf0px).to.be.eql(await bmpSubtractorService.getDifferenceBMP(bmpWithRadiusOf0px, blackBmp, radius));
    });

    it('Should apply 3 pixel enlargement radius for a given image ', async () => {
        const radius = 3;
        const bmpWithRadiusOf0px = await bmpDecoderService.decodeIntoBmp('./assets/test-bmp/test-radius/dot-with-radius-0px.bmp');
        const blackBmp = await bmpDecoderService.decodeIntoBmp('./assets/test-bmp/test-radius/no-dot-with-no-radius.bmp');
        const bmpWithRadiusOf3px = await bmpDecoderService.decodeIntoBmp('./assets/test-bmp/test-radius/dot-with-radius-3px.bmp');
        const bmpResulting = await bmpSubtractorService.getDifferenceBMP(bmpWithRadiusOf0px, blackBmp, radius);
        expect(bmpWithRadiusOf3px).to.be.eql(bmpResulting);
    });

    it('Should apply 9 pixel enlargement radius for a given image ', async () => {
        const radius = 9;
        const bmpWithRadiusOf0px = await bmpDecoderService.decodeIntoBmp('./assets/test-bmp/test-radius/dot-with-radius-0px.bmp');
        const blackBmp = await bmpDecoderService.decodeIntoBmp('./assets/test-bmp/test-radius/no-dot-with-no-radius.bmp');
        const bmpWithRadiusOf3px = await bmpDecoderService.decodeIntoBmp('./assets/test-bmp/test-radius/dot-with-radius-9px.bmp');
        const bmpResulting = await bmpSubtractorService.getDifferenceBMP(bmpWithRadiusOf0px, blackBmp, radius);
        expect(bmpWithRadiusOf3px).to.be.eql(bmpResulting);
    });

    it('Should apply 15 pixel enlargement radius for a given image ', async () => {
        const radius = 15;
        const bmpWithRadiusOf0px = await bmpDecoderService.decodeIntoBmp('./assets/test-bmp/test-radius/dot-with-radius-0px.bmp');
        const blackBmp = await bmpDecoderService.decodeIntoBmp('./assets/test-bmp/test-radius/no-dot-with-no-radius.bmp');
        const bmpWithRadiusOf3px = await bmpDecoderService.decodeIntoBmp('./assets/test-bmp/test-radius/dot-with-radius-15px.bmp');
        const bmpResulting = await bmpSubtractorService.getDifferenceBMP(bmpWithRadiusOf0px, blackBmp, radius);
        expect(bmpWithRadiusOf3px).to.be.eql(bmpResulting);
    });
});
