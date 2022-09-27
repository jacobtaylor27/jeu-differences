import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { expect } from 'chai';
import { describe } from 'mocha';

describe('BmpDecoder', () => {
    let bmpDecoderService: BmpDecoderService;

    beforeEach(async () => {
        bmpDecoderService = new BmpDecoderService();
    });

    it('Should create an object Bmp based on bmp file of size 2x2', async () => {
        const pixelsExpected = [
            [
                { a: 0, r: 0, g: 0, b: 255 },
                { a: 0, r: 255, g: 0, b: 0 },
            ],
            [
                { a: 0, r: 0, g: 255, b: 0 },
                { a: 0, r: 255, g: 255, b: 255 },
            ],
        ];

        const filepath = './assets/test-bmp/bmp_test_2x2.bmp';
        const bmpProduced = await bmpDecoderService.decode(filepath);

        expect(bmpProduced.getWidth()).to.equals(pixelsExpected[0].length);
        expect(bmpProduced.getHeight()).to.equals(pixelsExpected.length);
        expect(bmpProduced.getPixels()).to.eql(pixelsExpected);
    });

    it('Should create an object Bmp based on bmp file of size 3x2', async () => {
        const pixelsExpected = [
            [
                { a: 0, r: 0, g: 0, b: 255 },
                { a: 0, r: 255, g: 0, b: 0 },
                { a: 0, r: 128, g: 0, b: 128 },
            ],
            [
                { a: 0, r: 192, g: 192, b: 192 },
                { a: 0, r: 255, g: 255, b: 0 },
                { a: 0, r: 0, g: 255, b: 255 },
            ],
        ];

        const filepath = './assets/test-bmp/bmp_test_3x2.bmp';
        const bmpProduced = await bmpDecoderService.decode(filepath);
        expect(bmpProduced.getWidth()).to.equals(pixelsExpected[0].length);
        expect(bmpProduced.getHeight()).to.equals(pixelsExpected.length);
        expect(bmpProduced.getPixels()).to.eql(pixelsExpected);
    });

    it('Should create an object Bmp based on bmp file of size 2x3', async () => {
        const pixelsExpected = [
            [
                { a: 0, r: 0, g: 0, b: 255 },
                { a: 0, r: 255, g: 0, b: 0 },
            ],
            [
                { a: 0, r: 0, g: 255, b: 0 },
                { a: 0, r: 255, g: 0, b: 255 },
            ],
            [
                { a: 0, r: 192, g: 192, b: 192 },
                { a: 0, r: 128, g: 128, b: 128 },
            ],
        ];

        const filepath = './assets/test-bmp/bmp_test_2x3.bmp';
        const bmpProduced = await bmpDecoderService.decode(filepath);
        expect(bmpProduced.getWidth()).to.equals(pixelsExpected[0].length);
        expect(bmpProduced.getHeight()).to.equals(pixelsExpected.length);
        expect(bmpProduced.getPixels()).to.eql(pixelsExpected);
    });

    it('Should throw an error if the path is incorrect', async () => {
        const invalidPath = '';
        try {
            const bmpProduced = await bmpDecoderService.decode(invalidPath);
            expect(bmpProduced).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });

    it('Should throw an error if the file is not a bitmap', async () => {
        const filepath = './assets/test-bmp/jpg_test.jpg';
        try {
            const bmpProduced = await bmpDecoderService.decode(filepath);
            expect(bmpProduced).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });

    it("Should throw an error if the file is a bitmap but doesn't exists", async () => {
        const filepath = './assets/test-bmp/doesntexistfile.bmp';
        try {
            const bmpProduced = await bmpDecoderService.decode(filepath);
            expect(bmpProduced).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });
});
