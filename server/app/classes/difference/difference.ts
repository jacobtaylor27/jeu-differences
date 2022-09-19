import { Coordinate } from '@app/interface/coordinate';

export class Difference {
    private coordinate: Coordinate;

    constructor(coordinate: Coordinate) {
        this.coordinate = coordinate;
    }

    getCoordinate(): Coordinate {
        return this.coordinate;
    }
}
