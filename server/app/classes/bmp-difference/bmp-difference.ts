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

    private static drawContour(center: Coordinates, radius: number): Coordinates[] {
        let coordinates: Coordinates[] = new Array();
        if (radius === 0) return [center];

        let x = radius;
        let y = 0;

        coordinates = this.fillContour(center, radius, coordinates);
        coordinates.push({ x: center.x + x, y: center.y });

        if (radius > 0) {
            coordinates.push({ x: center.x - x, y: center.y });
            coordinates.push({ x: center.x, y: x + center.y });
            coordinates.push({ x: center.x, y: center.y - x });
        }

        let p = 1 - radius;

        while (x > y) {
            y++;
            if (p <= 0) {
                p = p + 2 * y + 1;
            } else {
                x--;
                p = p + 2 * y - 2 * x + 1;
            }
            if (x < y) {
                break;
            }

            coordinates.push({ x: x + center.x, y: y + center.y });
            coordinates.push({ x: -x + center.x, y: y + center.y });
            coordinates.push({ x: x + center.x, y: -y + center.y });
            coordinates.push({ x: -x + center.x, y: -y + center.y });

            if (x !== y) {
                coordinates.push({ x: y + center.x, y: x + center.y });
                coordinates.push({ x: -y + center.x, y: x + center.y });
                coordinates.push({ x: y + center.x, y: -x + center.y });
                coordinates.push({ x: -y + center.x, y: -x + center.y });
            }
        }

        return coordinates;
    }

    private static distance(pt1: Coordinates, pt2: Coordinates) {
        let dx = pt2.x - pt1.x;
        dx = dx * dx;
        let dy = pt2.y - pt1.y;
        dy = dy * dy;
        return Math.sqrt(dx + dy);
    }

    private static fillContour(coord: Coordinates, radius: number, coordinates: Coordinates[]) {
        for (let j = coord.x - radius; j <= coord.x + radius; j++) {
            for (let k = coord.y - radius; k <= coord.y + radius; k++) {
                if (this.distance({ x: j, y: k }, { x: coord.x, y: coord.y }) <= radius) coordinates.push({ x: j, y: k });
            }
        }

        return coordinates;
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

    private static getCoordinatesAfterEnlargement(originalCoordinates: Coordinates[], radius: number): Coordinates[] {
        const resultCoordinates: Coordinates[] = [];
        originalCoordinates.forEach((coordinate) => {
            const result = this.drawContour(coordinate, radius);
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
