import { BmpDecoder } from '@app/classes/bmp-decoder/bmp-decoder';
import { Bmp } from '@app/classes/bmp/bmp';
import { Coordinates } from '@app/interface/coordinates';
import { Pixel } from '@app/interface/pixel';
export class BmpDifference {
    static async getDifference(originalImagePath: string, modifiedImagePath: string): Promise<Bmp> {
        const originalImage = await BmpDecoder.decode(originalImagePath);
        const modifiedImage = await BmpDecoder.decode(modifiedImagePath);
        if (!this.areBmpCompatible(originalImage, modifiedImage)) throw new Error('Both images do not have the same height or width');

        const resultImage = new Bmp(modifiedImage.getWidth(), modifiedImage.getHeight(), Bmp.convertPixelsToRaw(modifiedImage.getPixels()));
        for (let i = 0; i < originalImage.getPixels().length; i++) {
            for (let j = 0; j < originalImage.getPixels()[i].length; j++) {
                if (this.arePixelsEqual(originalImage.getPixels()[i][j], modifiedImage.getPixels()[i][j])) {
                    this.setPixelWhite(resultImage.getPixels()[i][j]);
                } else {
                    this.setPixelBlack(resultImage.getPixels()[i][j]);
                }
            }
        }
        return resultImage;
    }

    static applyEnlargement(center: Coordinates, radius: number): Coordinates[] {
        const result: Coordinates[] = [];
        for (let i = -radius; i <= radius; i++) {
            for (let j = -radius; j <= radius; j++) {
                if (
                    Math.abs(i) <= Math.ceil(Math.sqrt(Math.pow(radius, 2) - Math.pow(j, 2))) &&
                    Math.abs(j) <= Math.ceil(Math.sqrt(Math.pow(radius, 2) - Math.pow(i, 2)))
                ) {
                    if (i + center.x >= 0 && j + center.y >= 0) result.push({ x: i + center.x, y: j + center.y });
                }
            }
        }
        return result;
    }
    static getBlackPixelsFromOriginalImage(differenceBmp: Bmp): Coordinates[] {
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

    static getCoordinatesAfterEnlargement(originalCoordinates: Coordinates[], radius: number): Coordinates[] {
        const resultCoordinates: Coordinates[] = [];
        originalCoordinates.forEach((coordinate) => {
            const result = this.applyEnlargement(coordinate, radius);
            result.forEach((coord) => {
                resultCoordinates.push(coord);
            });
        });
        return resultCoordinates;
    }

    static enlargePixelsArea(originalImage: Bmp, radius: number): Bmp {
        const resultCoordinates: Coordinates[] = this.getCoordinatesAfterEnlargement(this.getBlackPixelsFromOriginalImage(originalImage), radius);
        const pixelResult: Pixel[][] = originalImage.getPixels();
        resultCoordinates.forEach((coordinate) => {
            this.setPixelBlack(pixelResult[coordinate.x][coordinate.y]);
        });
        return new Bmp(originalImage.getWidth(), originalImage.getHeight(), Bmp.convertPixelsToRaw(pixelResult));
    }
    static isHeightEqual(originalImageHeight: number, modifiedImageHeight: number) {
        return originalImageHeight === modifiedImageHeight;
    }
    static isWidthEqual(originalImageWidth: number, modifiedImageWidth: number): boolean {
        return originalImageWidth === modifiedImageWidth;
    }
    static arePixelsEqual(originalImage: Pixel, modifiedImage: Pixel): boolean {
        return (
            originalImage.a === modifiedImage.a &&
            originalImage.b === modifiedImage.b &&
            originalImage.g === modifiedImage.g &&
            originalImage.r === modifiedImage.r
        );
    }
    static setPixelWhite(pixel: Pixel): Pixel {
        pixel.a = 0;
        pixel.b = 255;
        pixel.g = 255;
        pixel.r = 255;
        return pixel;
    }
    static setPixelBlack(pixel: Pixel): Pixel {
        pixel.a = 0;
        pixel.b = 0;
        pixel.g = 0;
        pixel.r = 0;
        return pixel;
    }
    static isBlackPixel(pixel: Pixel): boolean {
        return pixel.a === 0 && pixel.b === 0 && pixel.g === 0 && pixel.r === 0;
    }
    private static areBmpCompatible(originalImage: Bmp, modifiedImage: Bmp) {
        return originalImage.getHeight() === modifiedImage.getHeight() && originalImage.getWidth() === modifiedImage.getWidth();
    }
}
