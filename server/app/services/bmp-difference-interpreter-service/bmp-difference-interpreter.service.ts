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

        for (let i = 0; i < pixelNeighborsCoordinates.length; i++) {
            const coordinate: Coordinate = { x: pixelNeighborsCoordinates[i].x, y: pixelNeighborsCoordinates[i].y };
            if (!pixels[coordinate.x][coordinate.y].isVisited && pixels[coordinate.x][coordinate.y].isBlack()) {
                const newDfs = this.depthFirstSearch(pixels, coordinate.x, coordinate.y);
                differenceArea = differenceArea.concat(newDfs);
            }
        }
        return differenceArea;
    }

    private pixelNeighborsCoord(pixel: Coordinate): Coordinate[] {
        const coordinateResult: Coordinate[] = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const offsetCoord: Coordinate = { x: pixel.x + i, y: pixel.y + j };
                if (this.isCoordinateValid(offsetCoord) && (offsetCoord.x !== pixel.x || offsetCoord.y !== pixel.y)) {
                    coordinateResult.push(offsetCoord);
                }
            }
        }
        return coordinateResult;
    }

    private isCoordinateValid(coord: Coordinate) {
        return coord.x >= 0 && coord.x < DEFAULT_IMAGE_HEIGHT && coord.y >= 0 && coord.y < DEFAULT_IMAGE_WIDTH;
    }
}
