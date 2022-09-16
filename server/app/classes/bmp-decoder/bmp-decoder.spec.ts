import { BmpDecoder } from '@app/classes/bmp-decoder/bmp-decoder';
import { expect } from 'chai';
import { describe } from 'mocha';

describe('HttpException', () => {
    it('Should create an object Bmp based on bmp file of size 2x2', () => {
        const expectedWidth = 2;
        const expectedHeight = 2;
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
        const filepath = '../../assets/bmp_test_2x2.bmp';
        BmpDecoder.decode(filepath).then((bmpProduced) => {
            expect(bmpProduced.width).to.equals(expectedWidth);
            expect(bmpProduced.height).to.equals(expectedHeight);
            expect(bmpProduced.pixels).to.equals(pixelsExpected);
        });
    });
});
