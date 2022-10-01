import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { Bmp } from '@app/classes/bmp/bmp';
import { PIXEL_COLOR } from '@app/constants/pixel-color';
import { Pixel } from '@app/interface/pixel';
import { Coordinate } from '@common/coordinate';
import { Service } from 'typedi';

@Service()
export class BmpDifferenceInterpreter {
    async getCoordinates(bmpDifferentiated: Bmp): Promise<BmpCoordinate[][]> {
        if (!(await this.isBmpDifferentiated(bmpDifferentiated))) throw new Error('The pixels are not perfectly black or white');

        const differences: BmpCoordinate[][] = [];
        const pixels = bmpDifferentiated.getPixels();

        for (let row = 0; row < pixels.length; row++) {
            for (let column = 0; column < pixels[row].length; column++) {
                if (this.isPixelBlack(pixels[row][column])) {
                    const difference = await this.getRegion(pixels, row, column);
                    differences.push(difference);
                }
            }
        }
        return differences;
    }

    async getDifferenceBMP(originalImage: Bmp, modifiedImage: Bmp, radius: number): Promise<Bmp> {
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

        return this.createDifferencesBMP(resultImage, radius);
    }

    private createDifferencesBMP(originalImage: Bmp, radius: number): Bmp {
        if (radius < 0) throw new Error('radius should be greater or equal to zero');

        if (radius === 0) return originalImage;

        const resultCoordinates: Coordinate[] = this.getCoordinatesAfterEnlargement(this.getBlackPixelsFromOriginalImage(originalImage), radius);
        const pixelResult: Pixel[][] = originalImage.getPixels();
        resultCoordinates.forEach((coordinate) => {
            this.setPixelBlack(pixelResult[coordinate.x][coordinate.y]);
        });
        return new Bmp(originalImage.getWidth(), originalImage.getHeight(), Bmp.convertPixelsToRaw(pixelResult));
    }

    private getCoordinatesAfterEnlargement(originalCoordinates: Coordinate[], radius: number): Coordinate[] {
        const resultCoordinates: Coordinate[] = [];
        originalCoordinates.forEach((coordinate) => {
            const result = this.findEnlargementArea(coordinate, radius);
            result.forEach((coord) => {
                resultCoordinates.push(coord);
            });
        });
        return resultCoordinates;
    }

    private findEnlargementArea(center: Coordinate, radius: number) {
        return this.findInsideAreaEnlargement(center, radius, this.findContourEnlargement(center, radius));
    }

    private findContourEnlargement(center: Coordinate, radius: number): Coordinate[] {
        const coordinates: Coordinate[] = new Array();
        if (radius === 0) {
            coordinates.push(center);
            return coordinates;
        }

        // MID-POINT ALGORITHM
        let x = radius;
        let y = 0;

        coordinates.push({ x: center.x - x, y: center.y });
        coordinates.push({ x: center.x, y: x + center.y });
        coordinates.push({ x: center.x, y: center.y - x });

        let p = 1 - radius;

        while (x > y) {
            y++;

            // Inside or on the perimeter
            if (p <= 0) {
                p = p + 2 * y + 1;
            }
            // Outside the perimeter
            else {
                x--;
                p = p + 2 * y - 2 * x + 1;
            }
            // All points done
            if (x < y) {
                break;
            }

            // Add points in all 8 quadrants of the enlargement circle
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

    private distance(px1: Coordinate, px2: Coordinate) {
        let dx = px2.x - px1.x;
        dx = dx * dx;
        let dy = px2.y - px1.y;
        dy = dy * dy;
        return Math.sqrt(dx + dy);
    }

    private findInsideAreaEnlargement(coord: Coordinate, radius: number, coordinates: Coordinate[]) {
        for (let j = coord.x - radius; j <= coord.x + radius; j++) {
            for (let k = coord.y - radius; k <= coord.y + radius; k++) {
                if (this.distance({ x: j, y: k }, { x: coord.x, y: coord.y }) <= radius) coordinates.push({ x: j, y: k });
            }
        }

        return coordinates;
    }

    private getBlackPixelsFromOriginalImage(differenceBmp: Bmp): Coordinate[] {
        const coordinatesOfBlackPixels: Coordinate[] = [];
        for (let i = 0; i < differenceBmp.getPixels().length; i++) {
            for (let j = 0; j < differenceBmp.getPixels()[i].length; j++) {
                if (this.isPixelBlack(differenceBmp.getPixels()[i][j])) {
                    coordinatesOfBlackPixels.push({ x: i, y: j });
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

    private async getRegion(pixels: Pixel[][], row: number, column: number): Promise<BmpCoordinate[]> {
        if (row < 0 || column < 0 || row >= pixels.length || column >= pixels[row].length) {
            return [];
        }
        if (this.isPixelWhite(pixels[row][column])) {
            return [];
        }
        let differences: BmpCoordinate[] = [new BmpCoordinate(row, column)];
        this.setPixelWhite(pixels[row][column]);
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = column - 1; c <= column + 1; c++) {
                if (r !== row || c !== column) {
                    const newElement: BmpCoordinate[] = await this.getRegion(pixels, r, c);
                    differences = differences.concat(newElement);
                }
            }
        }
        return differences;
    }

    private isPixelColorMatch(pixel: Pixel, color: number) {
        return pixel.r === color && pixel.g === color && pixel.b === color;
    }

    private isPixelWhite(pixel: Pixel) {
        return this.isPixelColorMatch(pixel, PIXEL_COLOR.white);
    }

    private isPixelBlack(pixel: Pixel) {
        return this.isPixelColorMatch(pixel, PIXEL_COLOR.black);
    }

    private setPixelWhite(pixel: Pixel) {
        this.setPixelColor(pixel, PIXEL_COLOR.white);
    }

    private setPixelBlack(pixel: Pixel) {
        this.setPixelColor(pixel, PIXEL_COLOR.black);
    }

    private setPixelColor(pixel: Pixel, color: number) {
        pixel.b = color;
        pixel.g = color;
        pixel.r = color;
    }

    private async isBmpDifferentiated(bmp: Bmp): Promise<boolean> {
        const pixels: Pixel[][] = bmp.getPixels();
        for (const scanLine of pixels) {
            for (const pixel of scanLine) {
                if (!this.isPixelBlack(pixel) && !this.isPixelWhite(pixel)) {
                    return false;
                }
            }
        }
        return true;
    }
}
