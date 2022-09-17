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
});