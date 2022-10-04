import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { Bmp } from '@app/classes/bmp/bmp';
import { Pixel } from '@app/classes/pixel/pixel';
import { Coordinate } from '@common/coordinate';
import { Service } from 'typedi';

@Service()
export class BmpDifferenceInterpreter {
    async getCoordinates(bmpDifferentiated: Bmp): Promise<Coordinate[][]> {
        return (await this.getBmpCoordinates(bmpDifferentiated)).map((bmpCoordinates) =>
            bmpCoordinates.map((bmpCoordinate) => bmpCoordinate.toCoordinate()),
        );
    }

    async getBmpCoordinates(bmpDifferentiated: Bmp): Promise<BmpCoordinate[][]> {
        if (!(await this.isBmpDifferentiated(bmpDifferentiated))) throw new Error('The pixels are not perfectly black or white');

        const differences: BmpCoordinate[][] = [];
        const pixels = bmpDifferentiated.getPixels();

        for (let row = 0; row < pixels.length; row++) {
            for (let column = 0; column < pixels[row].length; column++) {
                if (pixels[row][column].isBlack()) {
                    const difference = await this.getRegion(pixels, row, column);
                    differences.push(difference);
                }
            }
        }
        return differences;
    }

    private async getRegion(pixels: Pixel[][], row: number, column: number): Promise<BmpCoordinate[]> {
        if (row < 0 || column < 0 || row >= pixels.length || column >= pixels[row].length) {
            return [];
        }
        if (pixels[row][column].isWhite()) {
            return [];
        }
        let differences: BmpCoordinate[] = [new BmpCoordinate(column, row)];
        pixels[row][column].setWhite();
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = column - 1; c <= column + 1; c++) {
                if (r !== row || c !== column) {
                    const newElement: BmpCoordinate[] = await this.getRegion(pixels, r, c);
                    differences = differences.concat(newElement);
                }
            }
        }
        return differences;
    }
    private async isBmpDifferentiated(bmp: Bmp): Promise<boolean> {
        const pixels: Pixel[][] = bmp.getPixels();
        for (const scanLine of pixels) {
            for (const pixel of scanLine) {
                if (!pixel.isBlack() && !pixel.isWhite()) {
                    return false;
                }
            }
        }
        return true;
    }
}
