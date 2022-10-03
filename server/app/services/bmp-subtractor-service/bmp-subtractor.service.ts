import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { Bmp } from '@app/classes/bmp/bmp';
import { Pixel } from '@app/classes/pixel/pixel';
import { Service } from 'typedi';
import { MidpointAlgorithm } from '../mid-point-algorithm/mid-point-algorithm';

@Service()
export class BmpSubtractorService {
    constructor(private midpointAlgorithm: MidpointAlgorithm) {}

    async getDifferenceBMP(originalImage: Bmp, modifiedImage: Bmp, radius: number): Promise<Bmp> {
        if (!this.areBmpCompatible(originalImage, modifiedImage)) {
            throw new Error('Both images do not have the same height or width');
        }

        const resultImage: Bmp = new Bmp(modifiedImage.getWidth(), modifiedImage.getHeight(), Pixel.convertPixelsToRaw(modifiedImage.getPixels()));

        for (let i = 0; i < originalImage.getPixels().length; i++) {
            for (let j = 0; j < originalImage.getPixels()[i].length; j++) {
                if (this.arePixelsEqual(originalImage.getPixels()[i][j], modifiedImage.getPixels()[i][j])) {
                    resultImage.getPixels()[i][j].setWhite();
                } else {
                    resultImage.getPixels()[i][j].setBlack();
                }
            }
        }

        return this.createDifferencesBMP(resultImage, radius);
    }

    private createDifferencesBMP(originalImage: Bmp, radius: number): Bmp {
        if (radius < 0) throw new Error('radius should be greater or equal to zero');

        if (radius === 0) return originalImage;

        const resultCoordinates: BmpCoordinate[] = this.getCoordinatesAfterEnlargement(this.getBlackPixelsFromOriginalImage(originalImage), radius);
        const pixelResult: Pixel[][] = originalImage.getPixels();
        resultCoordinates.forEach((coordinate) => {
            pixelResult[coordinate.getX()][coordinate.getY()].setBlack();
        });
        return new Bmp(originalImage.getWidth(), originalImage.getHeight(), Pixel.convertPixelsToRaw(pixelResult));
    }

    private getCoordinatesAfterEnlargement(originalCoordinates: BmpCoordinate[], radius: number): BmpCoordinate[] {
        const resultCoordinates: BmpCoordinate[] = [];
        originalCoordinates.forEach((coordinate) => {
            const result = this.midpointAlgorithm.findEnlargementArea(coordinate, radius);
            result.forEach((coord) => {
                resultCoordinates.push(new BmpCoordinate(coord.getX(), coord.getY()));
            });
        });
        return resultCoordinates;
    }

    private getBlackPixelsFromOriginalImage(differenceBmp: Bmp): BmpCoordinate[] {
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

    private arePixelsEqual(pixelOriginalImg: Pixel, pixelModifiedImg: Pixel): boolean {
        return (
            pixelOriginalImg.a === pixelModifiedImg.a &&
            pixelOriginalImg.b === pixelModifiedImg.b &&
            pixelOriginalImg.g === pixelModifiedImg.g &&
            pixelOriginalImg.r === pixelModifiedImg.r
        );
    }

    private areBmpCompatible(originalImage: Bmp, modifiedImage: Bmp): boolean {
        return originalImage.getHeight() === modifiedImage.getHeight() && originalImage.getWidth() === modifiedImage.getWidth();
    }
}
