/* eslint-disable @typescript-eslint/prefer-for-of */
import { Bmp } from '@app/classes/bmp/bmp';
import { Pixel } from '@app/classes/pixel/pixel';
import { Coordinate } from '@common/coordinate';
import { DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH } from '@common/image-size';
import { Service } from 'typedi';

@Service()
export class BmpDifferenceInterpreter {
    async getCoordinates(bmpDifferentiated: Bmp): Promise<Coordinate[][]> {
        const differences: Coordinate[][] = [];
        const pixels = bmpDifferentiated.getPixels();
        for (let row = 0; row < pixels.length; row++) {
            for (let column = 0; column < pixels[row].length; column++) {
                if (!pixels[row][column].isVisited && pixels[row][column].isBlack()) {
                    const difference = this.depthFirstSearch(pixels, row, column);
                    differences.push(difference);
                }
            }
        }
        return differences;
    }

    private depthFirstSearch(pixels: Pixel[][], row: number, column: number): Coordinate[] {
        pixels[row][column].isVisited = true;
        let differenceArea: Coordinate[] = [{ x: column, y: row }];
        const pixelNeighborsCoordinates = this.pixelNeighborsCoord({ x: row, y: column });

        }
        if (pixels[row][column].isWhite()) {
            return [];
        }
        return differenceArea;
        pixels[row][column].setWhite();

            for (let c = column - 1; c <= column + 1; c++) {
                if (r !== row || c !== column) {
                    const newElement: Coordinate[] = await this.getRegion(pixels, r, c);
                    differences = differences.concat(newElement);
                }
            }
        }
        return differences;
    private isCoordinateValid(coord: Coordinate) {
        return coord.x >= 0 && coord.x < DEFAULT_IMAGE_HEIGHT && coord.y >= 0 && coord.y < DEFAULT_IMAGE_WIDTH;
    }
}
