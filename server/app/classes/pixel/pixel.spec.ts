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
            // eslint-disable-next-line
            new Pixel(-1, 0, 0);
        }).to.throw(Error);

        expect(() => {
            // eslint-disable-next-line
            new Pixel(0, -1, 0);
        }).to.throw(Error);

        expect(() => {
            // eslint-disable-next-line
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
});
