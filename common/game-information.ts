import { Score } from '@common/score';

export interface GameInformation {
    id: string;
    name: string;
    thumbnail: string;
    idOriginalBmp: string;
    idEditedBmp: string;
    soloScore: Score[];
    multiplayerScore: Score[];
    nbDifferences: number;
}
