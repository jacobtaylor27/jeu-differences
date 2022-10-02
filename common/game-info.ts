import { Coordinate } from '@common/coordinate';
import { Score } from '@common/score';
export interface GameInfo {
    id?: string;
    name: string;
    idOriginalBmp: string;
    idEditedBmp: string;
    idDifferenceBmp?: string;
    soloScore?: Score[];
    multiplayerScore?: Score[];
    differenceRadius: number;
    differences: Coordinate[][];
}
