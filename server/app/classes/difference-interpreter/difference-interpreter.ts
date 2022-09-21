import { Bmp } from '@app/classes/bmp/bmp';
import { MAX_VALUE_PIXEL, MIN_VALUE_PIXEL } from '@app/constants/encoding';
import { Pixel } from '@app/interface/pixel';

export class DifferenceInterpreter {
    static getDifference(bmpDifferentiated: Bmp): number {
        if (!this.isBmpDifferentiated(bmpDifferentiated)) throw new Error('The pixels are not perfectly black or white');
        let maxRegion = 0;
        const pixels = bmpDifferentiated.getPixels();
        for (let row = 0; row < bmpDifferentiated.getWidth(); row++) {
            for (let column = 0; column < bmpDifferentiated.getHeight(); column++) {
                if (this.isPixelBlack(pixels[row][column])) {
                    const size = this.getRegion(pixels, row, column);
                    maxRegion = Math.max(size, maxRegion);
                }
            }
        }
        return maxRegion;
    }

    private static getRegion(pixels: Pixel[][], row: number, column: number): number {
        if (row < 0 || column < 0 || row >= pixels.length || column >= pixels[row].length) {
            return 0;
        }
        if (this.isPixelWhite(pixels[row][column])) {
            return 0;
        }
        let size = 1;
        this.setPixelWhite(pixels[row][column]);
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = column - 1; c <= column + 1; c++) {
                if (r !== row || c !== column) {
                    size += this.getRegion(pixels, r, c);
                }
            }
        }
        return size;
    }

    private static isPixelWhite(pixel: Pixel) {
        return pixel.r === MAX_VALUE_PIXEL && pixel.g === MAX_VALUE_PIXEL && pixel.b === MAX_VALUE_PIXEL;
    }

    private static isPixelBlack(pixel: Pixel) {
        return pixel.r === MIN_VALUE_PIXEL && pixel.g === MIN_VALUE_PIXEL && pixel.b === MIN_VALUE_PIXEL;
    }

    private static setPixelWhite(pixel: Pixel) {
        pixel.b = MAX_VALUE_PIXEL;
        pixel.g = MAX_VALUE_PIXEL;
        pixel.r = MAX_VALUE_PIXEL;
    }

    private static isBmpDifferentiated(bmp: Bmp): boolean {
        const pixels: Pixel[][] = bmp.getPixels();
        for (const scanLine of pixels) {
            for (const pixel of scanLine) {
                if (!this.isPixelBlack(pixel) && !this.isPixelWhite(pixel)) {
                    return false;
                }
            }
        }
        return true;
    }
}
