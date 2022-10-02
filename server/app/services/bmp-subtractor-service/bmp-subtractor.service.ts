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

        // MID-POINT ALGORITHM
        distance = { x: radius, y: 0 };
        let x = radius;
        let y = 0;

        this.addInitial4Coords(center, distance, coordinates);

        let perimeter = 1 - radius;

        while (x > y) {
            y++;

            // Inside or on the perimeter
            if (this.isInsidePerimeter(perimeter)) {
                perimeter = perimeter + 2 * y + 1;
            }
            // Outside the perimeter
            else {
                x--;
                perimeter = perimeter + 2 * y - 2 * x + 1;
            }
            // All points done
            if (x < y) {
                break;
            }

            this.addCoordsIn4Quadrants(center, distance, coordinates);
            // Add points in all 8 quadrants of the enlargement circle
            coordinates.push({ x: x + center.x, y: y + center.y });
            coordinates.push({ x: -x + center.x, y: y + center.y });
            coordinates.push({ x: x + center.x, y: -y + center.y });
            coordinates.push({ x: -x + center.x, y: -y + center.y });

            if (x !== y) {
                this.addCoordsIn4Quadrants(center, this.invertCoord(distance), coordinates);
                coordinates.push({ x: y + center.x, y: x + center.y });
                coordinates.push({ x: -y + center.x, y: x + center.y });
                coordinates.push({ x: y + center.x, y: -x + center.y });
                coordinates.push({ x: -y + center.x, y: -x + center.y });
            }
        }

        return coordinates;
    }

    private invertCoord(coord: Coordinate): Coordinate {
        const tempX = coord.x;
        coord.x = coord.y;
        coord.y = tempX;
        return coord;
    }

    private addInitial4Coords(center: Coordinate, distance: Coordinate, coordinates: Coordinate[]) {
        coordinates.push({ x: center.x + distance.x, y: center.y });
        coordinates.push({ x: center.x - distance.x, y: center.y });
        coordinates.push({ x: center.x, y: center.y + distance.x });
        coordinates.push({ x: center.x, y: center.y - distance.x });
    }

    private isInsidePerimeter(perimeter: number): boolean {
        return perimeter <= 0;
    }

    private addCoordsIn4Quadrants(center: Coordinate, distance: Coordinate, coordinates: Coordinate[]) {
        coordinates.push({ x: center.x + distance.x, y: center.y + distance.y });
        coordinates.push({ x: center.x - distance.x, y: center.y + distance.y });
        coordinates.push({ x: center.x + distance.x, y: center.y - distance.y });
        coordinates.push({ x: center.x - distance.x, y: center.y - distance.y });
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
