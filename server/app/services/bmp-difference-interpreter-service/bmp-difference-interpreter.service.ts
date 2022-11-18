/* eslint-disable @typescript-eslint/prefer-for-of */
import { Bmp } from '@app/classes/bmp/bmp';
import { Pixel } from '@app/classes/pixel/pixel';
import { Queue } from '@app/classes/queue/queue';
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
                    const difference = this.breadthFirstSearch(pixels, row, column);
                    differences.push(difference);
                }
            }
        }
        return differences;
    }

    private breadthFirstSearch(pixels: Pixel[][], row: number, column: number): Coordinate[] {
        const queue = new Queue();

        queue.add({ x: row, y: column });
        pixels[row][column].isVisited = true;

        const differenceArea: Coordinate[] = [{ x: column, y: row }];

        while (!queue.isEmpty()) {
            const coordinate: Coordinate = queue.peek();
            queue.remove();
            const pixelNeighborsCoordinates = this.pixelNeighborsCoord(coordinate);

            for (let i = 0; i < pixelNeighborsCoordinates.length; i++) {
                const coord: Coordinate = { x: pixelNeighborsCoordinates[i].x, y: pixelNeighborsCoordinates[i].y };

                if (!pixels[coord.x][coord.y].isVisited && pixels[coord.x][coord.y].isBlack()) {
                    pixels[coord.x][coord.y].isVisited = true;
                    // bfsParent[w] = v;
                    differenceArea.push(coord);
                    queue.add(coord);
                }
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
