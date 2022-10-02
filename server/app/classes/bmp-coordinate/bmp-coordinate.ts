import { Coordinate } from '@common/coordinate';

export class BmpCoordinate {
    private x: number;
    private y: number;

    constructor(row: number, column: number) {
        if (!this.areParametersValid(row, column)) throw new Error("The coordinates can't be negative");
        this.x = row;
        this.y = column;
    }

    getRow(): number {
        return this.x;
    }

    getColumn(): number {
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
