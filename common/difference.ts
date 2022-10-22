import { Coordinate } from './coordinate';

export interface DifferenceFound {
    difference: { coords: Coordinate[]; isPlayerFoundDifference: boolean };
    isGameOver: boolean;
    differenceLeft: number;
}
