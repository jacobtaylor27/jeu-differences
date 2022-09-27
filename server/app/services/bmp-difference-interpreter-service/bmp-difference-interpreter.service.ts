import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { Bmp } from '@app/classes/bmp/bmp';
import { PIXEL_COLOR } from '@app/constants/pixel-color';
import { Pixel } from '@app/interface/pixel';
import { Service } from 'typedi';

@Service()
export class BmpDifferenceInterpreter {
    getCoordinates(bmpDifferentiated: Bmp): BmpCoordinate[][] {
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

    private getRegion(pixels: Pixel[][], row: number, column: number): BmpCoordinate[] {
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
                    differences = differences.concat(newElement);
                }
            }
        }
        return differences;
    }

    private isPixelColorMatch(pixel: Pixel, color: number) {
        return pixel.r === color && pixel.g === color && pixel.b === color;
    }

    private isPixelWhite(pixel: Pixel) {
        return this.isPixelColorMatch(pixel, PIXEL_COLOR.white);
    }

    private isPixelBlack(pixel: Pixel) {
        return this.isPixelColorMatch(pixel, PIXEL_COLOR.black);
    }

    private setPixelWhite(pixel: Pixel) {
        this.setPixelColor(pixel, PIXEL_COLOR.white);
    }

    private setPixelColor(pixel: Pixel, color: number) {
        pixel.b = color;
        pixel.g = color;
        pixel.r = color;
    }

    private isBmpDifferentiated(bmp: Bmp): boolean {
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
