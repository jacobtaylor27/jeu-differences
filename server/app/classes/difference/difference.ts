import { Coordinate } from '@app/interface/coordinate';
import { Pixel } from '@app/interface/pixel';

export class Difference {
    private coordinate: Coordinate;
    private originalPixel: Pixel;
    private modifiedPixel: Pixel;

    constructor(coordinate: Coordinate, originalPixel: Pixel, modifiedPixel: Pixel) {
        this.coordinate = coordinate;
        this.originalPixel = originalPixel;
        this.modifiedPixel = modifiedPixel;
    }

    getCoordinate(): Coordinate {
        return this.coordinate;
    }
    getOriginalPixel(): Pixel {
        return this.originalPixel;
    }
    getModifiedPixel(): Pixel {
        return this.modifiedPixel;
    }
}
