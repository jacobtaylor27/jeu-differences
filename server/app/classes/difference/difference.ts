import { Coordinate } from '@app/interface/coordinate';

export class Difference {
    private coordinate: Coordinate;

    constructor(coordinate: Coordinate) {
        if (!this.isParameterValid(coordinate)) throw new Error('Les bmps ne peuvent pas avoir de coordonnées négatives.');
        this.coordinate = coordinate;
    }

    getCoordinate(): Coordinate {
        return this.coordinate;
    }

    private isParameterValid(coordinate: Coordinate): boolean {
        return coordinate.column >= 0 && coordinate.row >= 0;
    }
}
