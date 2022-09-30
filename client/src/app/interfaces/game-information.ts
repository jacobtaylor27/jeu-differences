import { Score } from '@common/score';

export interface GameInformation {
    imgName: string;
    name: string;
    scoresSolo: Score[];
    scoresMultiplayer: Score[];
}
