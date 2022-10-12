import { GameInfo } from '@common/game-info';
import { Score } from '@common/score';

const score: Score = {
    playerName: 'Mark',
    time: 23,
};
const game1: GameInfo = {
    id: '0',
    thumbnail: 'image',
    idOriginalBmp: '0',
    idEditedBmp: '0',
    idDifferenceBmp: '0',
    soloScore: [score],
    multiplayerScore: [score],
    name: 'Mark',
    differenceRadius: 1,
    differences: [],
};

export const DEFAULT_GAME: GameInfo[] = [game1];
