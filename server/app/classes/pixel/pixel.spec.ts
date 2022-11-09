import { PIXEL_COLOR } from '@app/constants/pixel-color';
import { expect } from 'chai';
import { describe } from 'mocha';
import { Pixel } from './pixel';

describe('Pixel', () => {
    it('Pixel constructor should create a pixel object', () => {
        const pixel = new Pixel(0, 0, 0);
        expect(pixel.a && pixel.b && pixel.g).to.equal(0);
    });

    it('Pixel constructor should not allow a pixel at its construction to be negative', () => {
        expect(() => {
            // eslint-disable-next-line -- no magic number
            new Pixel(-1, 0, 0);
        }).to.throw(Error);

        expect(() => {
            // eslint-disable-next-line -- no magic number
            new Pixel(0, -1, 0);
        }).to.throw(Error);

        expect(() => {
            // eslint-disable-next-line -- no magic number
            new Pixel(0, 0, -1);
        }).to.throw(Error);
    });

    it('isWhite(...) should return true given an array of pixels with 255 for their value', () => {
        const whitePixel: Pixel = new Pixel(PIXEL_COLOR.white, PIXEL_COLOR.white, PIXEL_COLOR.white);
        expect(whitePixel['isWhite']()).to.equal(true);
    });

    it("isWhite(...) should return false given an array of pixels that isn't perfectly white", () => {
        const whitePixel: Pixel = new Pixel(PIXEL_COLOR.white, PIXEL_COLOR.black, PIXEL_COLOR.white);
        expect(whitePixel['isWhite']()).to.equal(false);
    });

    it('isBlack(...) should return true given an array of pixels with 0 for their value', () => {
        const whitePixel: Pixel = new Pixel(PIXEL_COLOR.black, PIXEL_COLOR.black, PIXEL_COLOR.black);
        expect(whitePixel['isBlack']()).to.equal(true);
    });

    it("isBlack(...) should return false given an array of pixels that isn't perfectly black", () => {
        const whitePixel: Pixel = new Pixel(PIXEL_COLOR.black, PIXEL_COLOR.white, PIXEL_COLOR.black);
        expect(whitePixel['isBlack']()).to.equal(false);
    });

    it('arePixelValid(...) should return true when a pixel are superior to 0', () => {
        const whitePixel: Pixel = new Pixel(PIXEL_COLOR.black, PIXEL_COLOR.white, PIXEL_COLOR.black);
        expect(whitePixel['arePixelsValid'](0, 0, 0)).to.equal(true);
    });

    it('arePixelValid(...) should return false when a pixel is less then 0', () => {
        const whitePixel: Pixel = new Pixel(PIXEL_COLOR.black, PIXEL_COLOR.white, PIXEL_COLOR.black);
        // eslint-disable-next-line -- no magic number
        expect(whitePixel['arePixelsValid'](0, -1, 0)).to.equal(false);
    });

    it('isEqual(...) should return false when the pixels are not deeply the same', () => {
        const testPixel: Pixel = new Pixel(PIXEL_COLOR.black, PIXEL_COLOR.white, PIXEL_COLOR.black);
        const differentPixel: Pixel = new Pixel(PIXEL_COLOR.white, PIXEL_COLOR.white, PIXEL_COLOR.black);
        expect(testPixel.isEqual(differentPixel)).to.equal(false);
    });

    it('isEqual(...) should return true when the pixels deeply the same', () => {
        const testPixel: Pixel = new Pixel(PIXEL_COLOR.black, PIXEL_COLOR.white, PIXEL_COLOR.black);
        expect(testPixel.isEqual(testPixel)).to.equal(true);
    });
});
