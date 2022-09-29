import { Coordinate } from '@common/coordinate';
import { Score } from '@common/score';
export interface GameInfo {
    id?: number;
    idOriginalBmp: number;
    idEditedBmp: number;
    idDifferenceBmp: number;
    soloScore: Score[];
    multiplayerScore: Score[];
    name: string;
    differences: Coordinate[][];
}
