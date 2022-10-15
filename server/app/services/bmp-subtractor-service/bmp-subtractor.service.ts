import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { Bmp } from '@app/classes/bmp/bmp';
import { Pixel } from '@app/classes/pixel/pixel';
import { MAX_VALUE_PIXEL, MIN_VALUE_PIXEL } from '@app/constants/encoding';
import { MidpointAlgorithm } from '@app/services/mid-point-algorithm/mid-point-algorithm';
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

        const resultCoordinates: BmpCoordinate[] = await this.getCoordinatesAfterEnlargement(
            await this.getBlackPixelsFromOriginalImage(originalImage),
            radius,
        );
        const pixelResult: Pixel[][] = originalImage.getPixels();
        resultCoordinates.forEach((coord) => {
            pixelResult[coord.toCoordinate().x][coord.toCoordinate().y].setBlack();
        });
        return new Bmp(originalImage.getWidth(), originalImage.getHeight(), Pixel.convertPixelsToARGB(pixelResult));
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
                    coordinatesOfBlackPixels.push(new BmpCoordinate(i, j));
                }
            }
        }
        return coordinatesOfBlackPixels;
    }

    private areBmpCompatible(originalImage: Bmp, modifiedImage: Bmp): boolean {
        return originalImage.getHeight() === modifiedImage.getHeight() && originalImage.getWidth() === modifiedImage.getWidth();
    }
}
