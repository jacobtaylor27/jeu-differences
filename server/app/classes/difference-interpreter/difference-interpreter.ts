import { Bmp } from '@app/classes/bmp/bmp';
import { Difference } from '@app/classes/difference/difference';
import { MAX_VALUE_PIXEL, MIN_VALUE_PIXEL } from '@app/constants/encoding';
import { Pixel } from '@app/interface/pixel';

export class DifferenceInterpreter {
    static getDifference(bmpDifferentiated: Bmp): Difference[][] {
        if (!this.isBmpDifferentiated(bmpDifferentiated)) throw new Error('The pixels are not perfectly black or white');

        const regions: Difference[][] = [];
        const pixels = bmpDifferentiated.getPixels();

        for (let row = 0; row < bmpDifferentiated.getWidth(); row++) {
            for (let column = 0; column < bmpDifferentiated.getHeight(); column++) {
                if (this.isPixelBlack(pixels[row][column])) {
                    const region: Difference[] = this.getRegion(pixels, row, column);
                    if (region.length !== 0) regions.push(region);
                }
            }
        }
        return regions;
    }

    private static getRegion(pixels: Pixel[][], row: number, column: number): Difference[] {
        if (row < 0 || column < 0 || row >= pixels.length || column >= pixels[row].length) {
            return [];
        }
        if (this.isPixelWhite(pixels[row][column])) {
            return [];
        }
        this.setPixelWhite(pixels[row][column]);
        const region: Difference[] = [new Difference({ row, column })];
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = column - 1; c <= column + 1; c++) {
                if (r !== row && c !== column) {
                    region.concat(this.getRegion(pixels, r, c));
                }
            }
        }
        return region;
    }

    private static isPixelWhite(pixel: Pixel) {
        return pixel.r === MAX_VALUE_PIXEL && pixel.g === MAX_VALUE_PIXEL && pixel.b === MAX_VALUE_PIXEL;
    }

    private static isPixelBlack(pixel: Pixel) {
        return pixel.r === MIN_VALUE_PIXEL && pixel.g === MIN_VALUE_PIXEL && pixel.b === MIN_VALUE_PIXEL;
    }

    private static setPixelWhite(pixel: Pixel) {
        pixel.a = 0;
        pixel.b = 0;
        pixel.g = 0;
        pixel.r = 0;
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
