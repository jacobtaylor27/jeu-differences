import { Bmp } from '@app/classes/bmp/bmp';
import { MAX_VALUE_PIXEL, MIN_VALUE_PIXEL } from '@app/constants/encoding';
import { Coordinate } from '@app/interface/coordinate';
import { Pixel } from '@app/interface/pixel';
export class DifferenceInterpreter {
    static getDifference(bmpDifferentiated: Bmp) {
        if (!this.isBmpDifferentiated(bmpDifferentiated)) throw new Error('The pixels are not perfectly black or white');

        const regions: Coordinate[][] = [];
        const pixels = bmpDifferentiated.getPixels();

        for (let row = 0; row < bmpDifferentiated.getWidth(); row++) {
            for (let column = 0; column < bmpDifferentiated.getHeight(); column++) {
                if (this.isPixelWhite(pixels[row][column])) {
                    const region: Coordinate[] = this.getRegion(pixels, row, column);
                    if (region.length !== 0) regions.push(region);
                }
            }
        }
        return regions;
    }

    private static getRegion(pixels: Pixel[][], row: number, column: number): Coordinate[] {
        if (row < 0 || column < 0 || row >= pixels.length || column >= pixels[row].length) {
            return [];
        }
        if (this.isPixelBlack(pixels[row][column])) {
            return [];
        }
        const region: Coordinate[] = [];
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = column - 1; c <= column + 1; c++) {
                region.concat(this.getRegion(pixels, r, c));
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
