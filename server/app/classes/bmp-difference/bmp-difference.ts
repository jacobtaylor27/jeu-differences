import { Bmp } from '@app/classes/bmp/bmp';
import { Coordinates } from '@app/interface/coordinates';
import { Pixel } from '@app/interface/pixel';
export class BmpDifference {
    static async getDifference(originalImage: Bmp, modifiedImage: Bmp, radius: number): Promise<Bmp> {
        if (!this.areBmpCompatible(originalImage, modifiedImage)) {
            throw new Error('Both images do not have the same height or width');
        }
        const resultImage: Bmp = new Bmp(modifiedImage.getWidth(), modifiedImage.getHeight(), Bmp.convertPixelsToRaw(modifiedImage.getPixels()));
        for (let i = 0; i < originalImage.getPixels().length; i++) {
            for (let j = 0; j < originalImage.getPixels()[i].length; j++) {
                if (this.arePixelsEqual(originalImage.getPixels()[i][j], modifiedImage.getPixels()[i][j])) {
                    this.setPixelWhite(resultImage.getPixels()[i][j]);
                } else {
                    this.setPixelBlack(resultImage.getPixels()[i][j]);
                }
            }
        }
        return this.createBmpWithDifferences(resultImage, radius);
    }
    private static applyEnlargement(center: Coordinates, radius: number): Coordinates[] {
        if (radius === 0) return [center];

        const result: Coordinates[] = [];
        const xVariableForDecisionParameter = 4;
        const constToAddForNegativeDecisionParameter = 6;
        const constToAddForPositiveDecisionParameter = 10;
        let decisionParameter: number = 3 - 2 * radius;
        let xCoords = 0;
        let y = radius;
        for (let k = radius; k >= 0; k--) {
            this.getSymmetricalPixels({ x: 0, y: k }, center, result);
        }
        for (let i = radius; i > 0; i--) {
            xCoords++;
            if (decisionParameter < 0) {
                decisionParameter = decisionParameter + xVariableForDecisionParameter * xCoords + constToAddForNegativeDecisionParameter;
            } else {
                decisionParameter = decisionParameter + xVariableForDecisionParameter * (xCoords - y) + constToAddForPositiveDecisionParameter;
                y--;
            }
            let yAxisPixel: number = y;
            while (yAxisPixel >= 0) {
                this.getSymmetricalPixels({ x: xCoords, y: yAxisPixel }, center, result);
                yAxisPixel--;
            }
        }
        for (let i = y; i >= 0; --i) {
            this.getSymmetricalPixels({ x: xCoords, y: i }, center, result);
        }
        return result;
    }
    private static createBmpWithDifferences(originalImage: Bmp, radius: number): Bmp {
        if (radius < 0) throw new Error('radius should be greater or equal to zero');
        if (radius === 0) return originalImage;
        const resultCoordinates: Coordinates[] = this.getCoordinatesAfterEnlargement(this.getBlackPixelsFromOriginalImage(originalImage), radius);
        const pixelResult: Pixel[][] = originalImage.getPixels();
        resultCoordinates.forEach((coordinate) => {
            this.setPixelBlack(pixelResult[coordinate.x][coordinate.y]);
        });
        return new Bmp(originalImage.getWidth(), originalImage.getHeight(), Bmp.convertPixelsToRaw(pixelResult));
    }

    private static getBlackPixelsFromOriginalImage(differenceBmp: Bmp): Coordinates[] {
        const coordinatesOfBlackPixels: Coordinates[] = [];
        for (let i = 0; i < differenceBmp.getPixels().length; i++) {
            for (let j = 0; j < differenceBmp.getPixels()[i].length; j++) {
                if (this.isBlackPixel(differenceBmp.getPixels()[i][j])) {
                    coordinatesOfBlackPixels.push({ x: i, y: j });
                }
            }
        }
        return coordinatesOfBlackPixels;
    }
    private static getSymmetricalPixels(pixelCoordinate: Coordinates, center: Coordinates, coordinatesArray: Coordinates[]) {
        coordinatesArray.push({ x: pixelCoordinate.x + center.x, y: pixelCoordinate.y + center.y });
        coordinatesArray.push({ x: -pixelCoordinate.x + center.x, y: pixelCoordinate.y + center.y });
        coordinatesArray.push({ x: pixelCoordinate.x + center.x, y: -pixelCoordinate.y + center.y });
        coordinatesArray.push({ x: -pixelCoordinate.x + center.x, y: -pixelCoordinate.y + center.y });
    }

    private static getCoordinatesAfterEnlargement(originalCoordinates: Coordinates[], radius: number): Coordinates[] {
        const resultCoordinates: Coordinates[] = [];
        originalCoordinates.forEach((coordinate) => {
            const result = this.applyEnlargement(coordinate, radius);
            result.forEach((coord) => {
                resultCoordinates.push(coord);
            });
        });
        return resultCoordinates;
    }
    private static arePixelsEqual(pixelOriginalImg: Pixel, pixelModifiedImg: Pixel): boolean {
        return (
            pixelOriginalImg.a === pixelModifiedImg.a &&
            pixelOriginalImg.b === pixelModifiedImg.b &&
            pixelOriginalImg.g === pixelModifiedImg.g &&
            pixelOriginalImg.r === pixelModifiedImg.r
        );
    }
    private static setPixelWhite(pixel: Pixel): Pixel {
        pixel.a = 0;
        pixel.b = 255;
        pixel.g = 255;
        pixel.r = 255;
        return pixel;
    }
    private static setPixelBlack(pixel: Pixel): Pixel {
        pixel.a = 0;
        pixel.b = 0;
        pixel.g = 0;
        pixel.r = 0;
        return pixel;
    }
    private static isBlackPixel(pixel: Pixel): boolean {
        return pixel.a === 0 && pixel.b === 0 && pixel.g === 0 && pixel.r === 0;
    }
    private static areBmpCompatible(originalImage: Bmp, modifiedImage: Bmp): boolean {
        return originalImage.getHeight() === modifiedImage.getHeight() && originalImage.getWidth() === modifiedImage.getWidth();
    }
}
