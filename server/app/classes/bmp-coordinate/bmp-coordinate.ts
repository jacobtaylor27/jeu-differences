export class BmpCoordinate {
    private row: number;
    private column: number;

    constructor(row: number, column: number) {
        if (!this.areParametersValid(row, column)) throw new Error("The coordinates can't be negative");
        this.row = row;
        this.column = column;
    }

    getRow(): number {
        return this.row;
    }
    getColumn(): number {
        return this.column;
    }

    private areParametersValid(row: number, column: number): boolean {
        return row >= 0 && column >= 0;
    }
}
