import { Score } from '@common/score';
export interface GameCard {
    id: number;
    idOriginalBmp: number;
    bestScores: Score[];
    name: string;
}
