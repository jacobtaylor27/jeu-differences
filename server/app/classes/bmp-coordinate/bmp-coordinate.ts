import { Coordinate } from '@common/coordinate';

export class BmpCoordinate {
    private x: number;
    private y: number;

    constructor(x: number, y: number) {
        if (!this.areParametersValid(x, y)) throw new Error("The coordinates can't be negative");
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

    private areParametersValid(row: number, column: number): boolean {
        return row >= 0 && column >= 0;
    }
}
