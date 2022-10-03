import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { Bmp } from '@app/classes/bmp/bmp';
import { Pixel } from '@app/classes/pixel/pixel';
import { Coordinate } from '@common/coordinate';
import { Service } from 'typedi';

@Service()
export class BmpSubtractorService {
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
            const result = this.findEnlargementArea(coordinate, radius);
            result.forEach((coord) => {
                resultCoordinates.push(new BmpCoordinate(coord.getX(), coord.getY()));
            });
        });
        return resultCoordinates;
    }

    private findEnlargementArea(center: BmpCoordinate, radius: number) {
        return this.findInsideAreaEnlargement(center, radius, this.findContourEnlargement(center, radius));
    }

    private findContourEnlargement(center: BmpCoordinate, radius: number): BmpCoordinate[] {
        const coordinates: BmpCoordinate[] = new Array();

        if (radius === 0) {
            coordinates.push(new BmpCoordinate(center.getX(), center.getY()));
            return coordinates;
        }

        const distance: Coordinate = { x: radius, y: 0 };

        this.addInitial4Coords(center, distance, coordinates);

        let perimeter = 1 - radius;

        while (this.isInQuadrant(distance)) {
            distance.y++;

            perimeter = this.incrementPerimeter(perimeter, distance);
            if (this.isOutsideQuadrant(distance)) {
                break;
            }

            this.addCoords(center, distance, coordinates);
        }

        return coordinates;
    }

    private isInQuadrant(distance: Coordinate) {
        return distance.x > distance.y;
    }

    private isOutsideQuadrant(distance: Coordinate) {
        return distance.x < distance.y;
    }

    private invertDistance(distance: Coordinate) {
        return { x: distance.y, y: distance.x };
    }

    private isInsidePerimeter(perimeter: number): boolean {
        return perimeter <= 0;
    }

    private isNotEquidistant(distance: Coordinate) {
        return distance.x !== distance.y;
    }

    private incrementPerimeter(perimeter: number, distance: Coordinate): number {
        if (this.isInsidePerimeter(perimeter)) {
            perimeter = perimeter + 2 * distance.y + 1;
        } else {
            distance.x--;
            perimeter = perimeter + 2 * distance.y - 2 * distance.x + 1;
        }
        return perimeter;
    }

    private addInitial4Coords(center: BmpCoordinate, distance: Coordinate, coordinates: BmpCoordinate[]) {
        coordinates.push(new BmpCoordinate(center.getX() + distance.x, center.getY()));
        coordinates.push(new BmpCoordinate(center.getX() - distance.x, center.getY()));
        coordinates.push(new BmpCoordinate(center.getX(), center.getY() + distance.x));
        coordinates.push(new BmpCoordinate(center.getX(), center.getY() - distance.x));
    }

    private addCoordsIn4Quadrants(center: BmpCoordinate, distance: Coordinate, coordinates: BmpCoordinate[]) {
        coordinates.push(new BmpCoordinate(center.getX() + distance.x, center.getY() + distance.y));
        coordinates.push(new BmpCoordinate(center.getX() - distance.x, center.getY() + distance.y));
        coordinates.push(new BmpCoordinate(center.getX() + distance.x, center.getY() - distance.y));
        coordinates.push(new BmpCoordinate(center.getX() - distance.x, center.getY() - distance.y));
    }

    private addCoords(center: BmpCoordinate, distance: Coordinate, coordinates: BmpCoordinate[]) {
        this.addCoordsIn4Quadrants(center, distance, coordinates);

        if (this.isNotEquidistant(distance)) {
            this.addCoordsIn4Quadrants(center, this.invertDistance(distance), coordinates);
        }
    }

    private distance(px1: Coordinate, px2: Coordinate) {
        let dx = px2.x - px1.x;
        dx = dx * dx;
        let dy = px2.y - px1.y;
        dy = dy * dy;
        return Math.sqrt(dx + dy);
    }

    private findInsideAreaEnlargement(coord: BmpCoordinate, radius: number, coordinates: BmpCoordinate[]) {
        for (let j = coord.getX() - radius; j <= coord.getX() + radius; j++) {
            for (let k = coord.getY() - radius; k <= coord.getY() + radius; k++) {
                if (this.distance({ x: j, y: k }, { x: coord.getX(), y: coord.getY() }) <= radius) coordinates.push(new BmpCoordinate(j, k));
            }
        }

        return coordinates;
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
