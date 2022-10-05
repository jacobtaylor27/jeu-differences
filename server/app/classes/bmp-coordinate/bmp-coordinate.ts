import { Coordinate } from '@common/coordinate';

const HEIGHT = 480;
const WIDTH = 640;

export class BmpCoordinate {
    private x: number;
    private y: number;

    constructor(x: number, y: number) {
        if (!this.areParametersValid(x, y)) {
            return;
        }
        this.x = x;
        this.y = y;
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    toCoordinate(): Coordinate {
        return {
            x: this.x,
            y: this.y,
        };
    }

    private areParametersValid(x: number, y: number): boolean {
        return this.isXCoordinateValid(x) && this.isYCoordinateValid(y);
    }

    private isXCoordinateValid(x: number) {
        return x >= 0 && x <= WIDTH;
    }

    private isYCoordinateValid(y: number) {
        return y >= 0 && y <= HEIGHT;
    }
}
