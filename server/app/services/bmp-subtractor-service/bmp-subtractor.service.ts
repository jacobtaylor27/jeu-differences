import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { Bmp } from '@app/classes/bmp/bmp';
import { Pixel } from '@app/classes/pixel/pixel';
import { MAX_VALUE_PIXEL, MIN_VALUE_PIXEL } from '@app/constants/encoding';
import { MidpointAlgorithm } from '@app/services/mid-point-algorithm/mid-point-algorithm';
import { Coordinate } from '@common/coordinate';
// import { Coordinate } from '@common/coordinate';
import { Service } from 'typedi';

@Service()
export class BmpSubtractorService {
    constructor(private midpointAlgorithm: MidpointAlgorithm) {}

    async getDifferenceBMP(originalImage: Bmp, modifiedImage: Bmp, radius: number): Promise<Bmp> {
        if (!this.areBmpCompatible(originalImage, modifiedImage)) {
            throw new Error('Both images do not have the same height or width');
        }
        const differenceImage0px: Bmp = await this.getDifference(originalImage, modifiedImage);
        return this.applyEnlargment(differenceImage0px, radius);
    }

    private async getDifference(originalImage: Bmp, modifiedImage: Bmp): Promise<Bmp> {
        const buffer: number[] = [];

        for (let i = 0; i < originalImage.getHeight(); i++) {
            for (let j = 0; j < originalImage.getWidth(); j++) {
                if (originalImage.getPixels()[i][j].isEqual(modifiedImage.getPixels()[i][j])) {
                    buffer.push(MAX_VALUE_PIXEL, MAX_VALUE_PIXEL, MAX_VALUE_PIXEL, MAX_VALUE_PIXEL);
                } else {
                    buffer.push(MAX_VALUE_PIXEL, MIN_VALUE_PIXEL, MIN_VALUE_PIXEL, MIN_VALUE_PIXEL);
                }
            }
        }
        return new Bmp(modifiedImage.getWidth(), modifiedImage.getHeight(), buffer);
    }

    private async applyEnlargment(originalImage: Bmp, radius: number): Promise<Bmp> {
        if (radius < 0) throw new Error('radius should be greater or equal to zero');
        if (radius === 0) return originalImage;
        // const pixelsToEnlarge: BmpCoordinate[] = [];
        const blackPixels: BmpCoordinate[] = await this.getBlackPixelsFromOriginalImage(originalImage);
        // blackPixels.forEach((pixel) => {
        //     if (this.isEdgePoint(pixel, blackPixels)) {
        //         pixelsToEnlarge.push(pixel);
        //     }
        // });
        const resultCoordinates: BmpCoordinate[] = await this.getCoordinatesAfterEnlargement(blackPixels, radius);
        const pixelResult: Pixel[][] = originalImage.getPixels();
        resultCoordinates.forEach((coord) => {
            if (coord.toCoordinate().x < originalImage.getHeight() && coord.toCoordinate().y < originalImage.getWidth())
                pixelResult[coord.toCoordinate().x][coord.toCoordinate().y].setBlack();
        });
        return new Bmp(originalImage.getWidth(), originalImage.getHeight(), Pixel.convertPixelsToARGB(pixelResult));
    }

    // private isEdgePoint(pixel: BmpCoordinate, blackPixelArray: BmpCoordinate[]): boolean {
    //     const neighborsArray: Coordinate[] = this.findNeighbors(pixel);
    //     let result = false;
    //     neighborsArray.forEach((neighbor) => {
    //         if (
    //             !blackPixelArray.some(
    //                 (coord) => coord.toCoordinate().x === neighbor.toCoordinate().x && coord.toCoordinate().y === neighbor.toCoordinate().y,
    //             )
    //         )
    //             result = true;
    //     });
    //     return result;
    // }

    private findNeighbors(pixel: Coordinate, coordinatesOfBlackPixels: BmpCoordinate[], differenceBmp: Bmp) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const offsetX = pixel.x + i;
                const offsetY = pixel.y + j;
                if (
                    offsetX >= 0 &&
                    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                    offsetX < 480 &&
                    offsetY >= 0 &&
                    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                    offsetY < 640
                ) {
                    if (differenceBmp.getPixels()[offsetX][offsetY].isWhite()) {
                        coordinatesOfBlackPixels.push(new BmpCoordinate(pixel.x, pixel.y));
                        return;
                    }
                }
            }
        }
    }

    private async getCoordinatesAfterEnlargement(originalCoordinates: BmpCoordinate[], radius: number): Promise<BmpCoordinate[]> {
        const resultCoordinates: BmpCoordinate[] = [];
        originalCoordinates.forEach((coordinate) => {
            const result = this.midpointAlgorithm.findEnlargementArea(coordinate, radius);
            result.forEach((coord) => {
                resultCoordinates.push(new BmpCoordinate(coord.getX(), coord.getY()));
            });
        });
        return resultCoordinates;
    }

    private async getBlackPixelsFromOriginalImage(differenceBmp: Bmp): Promise<BmpCoordinate[]> {
        const coordinatesOfBlackPixels: BmpCoordinate[] = [];
        const pixels: Pixel[][] = differenceBmp.getPixels();
        for (let i = 0; i < pixels.length; i++) {
            for (let j = 0; j < pixels[i].length; j++) {
                if (pixels[i][j].isBlack()) {
                    this.findNeighbors({ x: i, y: j }, coordinatesOfBlackPixels, differenceBmp);
                }
            }
        }
        return coordinatesOfBlackPixels;
    }

    private areBmpCompatible(originalImage: Bmp, modifiedImage: Bmp): boolean {
        return originalImage.getHeight() === modifiedImage.getHeight() && originalImage.getWidth() === modifiedImage.getWidth();
    }
}
