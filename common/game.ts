import { Coordinate } from './coordinate';

export interface Game {
    id: number;
    idOriginalBmp: number;
    idEditedBmp: number;
    idDifferenceBmp: number;
    bestTimes: string;
    name: string;
    differences: Coordinate[][];
}
