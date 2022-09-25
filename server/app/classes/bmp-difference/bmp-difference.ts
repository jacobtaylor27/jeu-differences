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

    private static applyEnlargement(center: Coordinates, radius: number): Coordinates[] {
        const result: Coordinates[] = [];
        for (let i = -radius; i <= radius; i++) {
            for (let j = -radius; j <= radius; j++) {
                if (this.isInsideBoundaries({ x: i, y: j }, center, radius)) result.push({ x: i + center.x, y: j + center.y });
            }
        }
        return result;
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
    private static isInsideBoundaries(coordinate: Coordinates, center: Coordinates, radius: number): boolean {
        if (
            Math.abs(coordinate.x) <= Math.ceil(Math.sqrt(Math.pow(radius, 2) - Math.pow(coordinate.y, 2))) &&
            Math.abs(coordinate.y) <= Math.ceil(Math.sqrt(Math.pow(radius, 2) - Math.pow(coordinate.x, 2)))
        ) {
            if (coordinate.x + center.x >= 0 && coordinate.y + center.y >= 0) return true;
        }
        return false;
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
