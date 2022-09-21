import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { Bmp } from '@app/classes/bmp/bmp';
import { MAX_VALUE_PIXEL, MIN_VALUE_PIXEL } from '@app/constants/encoding';
import { Pixel } from '@app/interface/pixel';

export class DifferenceInterpreter {
    static getCoordinates(bmpDifferentiated: Bmp): BmpCoordinate[][] {
        if (!this.isBmpDifferentiated(bmpDifferentiated)) throw new Error('The pixels are not perfectly black or white');

        const differences: BmpCoordinate[][] = [];
        const pixels = bmpDifferentiated.getPixels();

        for (let row = 0; row < pixels.length; row++) {
            for (let column = 0; column < pixels[row].length; column++) {
                if (this.isPixelBlack(pixels[row][column])) {
                    const difference = this.getRegion(pixels, row, column);
                    differences.push(difference);
                }
            }
        }
        return differences;
    }

    private static getRegion(pixels: Pixel[][], row: number, column: number): BmpCoordinate[] {
        if (row < 0 || column < 0 || row >= pixels.length || column >= pixels[row].length) {
            return [];
        }
        if (this.isPixelWhite(pixels[row][column])) {
            return [];
        }
        let differences: BmpCoordinate[] = [new BmpCoordinate(row, column)];
        this.setPixelWhite(pixels[row][column]);
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = column - 1; c <= column + 1; c++) {
                if (r !== row || c !== column) {
                    const newElement: BmpCoordinate[] = this.getRegion(pixels, r, c);
                    differences = this.insertElement(differences, newElement);
                }
            }
        }
        return differences;
    }

    private static insertElement(oldArray: BmpCoordinate[], newElement: BmpCoordinate[]): BmpCoordinate[] {
        const bmpCoordinates: BmpCoordinate[] = [];
        oldArray.forEach((coordinate) => {
            bmpCoordinates.push(coordinate);
        });
        newElement.forEach((coordinate) => {
            bmpCoordinates.push(coordinate);
        });
        return bmpCoordinates;
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
