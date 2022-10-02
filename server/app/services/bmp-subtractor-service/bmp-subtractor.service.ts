import { Bmp } from '@app/classes/bmp/bmp';
import { Pixel } from '@app/classes/pixel/pixel';
import { Coordinate } from '@common/coordinate';
import { Service } from 'typedi';

@Service()
export class BmpSubtractorService {
    WIDTH: number = 640;
    HEIGHT = 420;
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

        const resultCoordinates: Coordinate[] = this.getCoordinatesAfterEnlargement(this.getBlackPixelsFromOriginalImage(originalImage), radius);
        const pixelResult: Pixel[][] = originalImage.getPixels();
        resultCoordinates.forEach((coordinate) => {
            pixelResult[coordinate.x][coordinate.y].setBlack();
        });
        return new Bmp(originalImage.getWidth(), originalImage.getHeight(), Pixel.convertPixelsToRaw(pixelResult));
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
        let distance: Coordinate;

        if (radius === 0) {
            coordinates.push(center);
            return coordinates;
        }

        distance = { x: radius, y: 0 };

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

    private isXCoordinateValid(x: number) {
        return x >= 0 && x <= this.WIDTH;
    }

    private isYCoordinateValid(y: number) {
        return y >= 0 && y <= this.HEIGHT;
    }

    private isValidCoordinate(coordinate: Coordinate) {
        return this.isXCoordinateValid(coordinate.x) && this.isYCoordinateValid(coordinate.y);
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

    private addCoordToArray(coord: Coordinate, coordinates: Coordinate[]) {
        if (this.isValidCoordinate(coord)) coordinates.push(coord);
    }

    private addInitial4Coords(center: Coordinate, distance: Coordinate, coordinates: Coordinate[]) {
        this.addCoordToArray({ x: center.x - distance.x, y: center.y }, coordinates);
        this.addCoordToArray({ x: center.x, y: center.y + distance.x }, coordinates);
        this.addCoordToArray({ x: center.x, y: center.y - distance.x }, coordinates);
    }

    private addCoordsIn4Quadrants(center: Coordinate, distance: Coordinate, coordinates: Coordinate[]) {
        this.addCoordToArray({ x: center.x + distance.x, y: center.y + distance.y }, coordinates);
        this.addCoordToArray({ x: center.x - distance.x, y: center.y + distance.y }, coordinates);
        this.addCoordToArray({ x: center.x + distance.x, y: center.y - distance.y }, coordinates);
        this.addCoordToArray({ x: center.x - distance.x, y: center.y - distance.y }, coordinates);
    }

    private addCoords(center: Coordinate, distance: Coordinate, coordinates: Coordinate[]) {
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
        const pixels: Pixel[][] = differenceBmp.getPixels();
        for (let i = 0; i < pixels.length; i++) {
            for (let j = 0; j < pixels[i].length; j++) {
                if (pixels[i][j].isBlack()) {
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
}
