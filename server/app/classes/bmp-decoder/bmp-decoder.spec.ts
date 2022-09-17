import { BmpDecoder } from '@app/classes/bmp-decoder/bmp-decoder';
import { expect } from 'chai';
import { describe } from 'mocha';

describe('BmpDecoder', () => {
    it('Should create an object Bmp based on bmp file of size 2x2', async () => {
        const expectedWidth = 2;
        const expectedHeight = 2;
        const pixelsExpected = [
            [
                { a: 0, b: 0, g: 0, r: 255 },
                { a: 0, b: 255, g: 0, r: 0 },
            ],
            [
                { a: 0, b: 0, g: 255, r: 0 },
                { a: 0, b: 255, g: 255, r: 255 },
            ],
        ];
        const filepath = './assets/bmp_test_2x2.bmp';
        const bmpProduced = await BmpDecoder.decode(filepath);

        expect(bmpProduced.width).to.equals(expectedWidth);
        expect(bmpProduced.height).to.equals(expectedHeight);
        expect(bmpProduced.pixels).to.eql(pixelsExpected);
    });

    it('Should create an object Bmp based on bmp file of size 3x2', async () => {
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
        const bmpProduced = await BmpDecoder.decode(filepath);
        expect(bmpProduced.width).to.equals(expectedWidth);
        expect(bmpProduced.height).to.equals(expectedHeight);
        expect(bmpProduced.pixels).to.eql(pixelsExpected);
    });

    it('Should create an object Bmp based on bmp file of size 2x3', async () => {
        const expectedWidth = 2;
        const expectedHeight = 3;
        const pixelsExpected = [
            [
                { a: 0, b: 0, g: 0, r: 255 },
                { a: 0, b: 255, g: 0, r: 0 },
            ],
            [
                { a: 0, b: 0, g: 255, r: 0 },
                { a: 0, b: 255, g: 0, r: 255 },
            ],
            [
                { a: 0, b: 192, g: 192, r: 192 },
                { a: 0, b: 128, g: 128, r: 128 },
            ],
        ];

        const filepath = './assets/bmp_test_2x3.bmp';
        const bmpProduced = await BmpDecoder.decode(filepath);
        expect(bmpProduced.width).to.equals(expectedWidth);
        expect(bmpProduced.height).to.equals(expectedHeight);
        expect(bmpProduced.pixels).to.eql(pixelsExpected);
    });

    it('Should throw an error if the path is incorrect', async () => {
        const invalidPath = '';
        try {
            const bmpProduced = await BmpDecoder.decode(invalidPath);
            expect(bmpProduced).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });

    it('Should throw an error if the file is not a bitmap', async () => {
        const filepath = './assets/jpg_test.jpg';
        try {
            const bmpProduced = await BmpDecoder.decode(filepath);
            expect(bmpProduced).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });
});
