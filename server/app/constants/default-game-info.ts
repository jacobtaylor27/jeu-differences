import { PrivateGameInformation } from '@app/interface/game-info';
import { Score } from '@common/score';

const score: Score = {
    playerName: 'Mark',
    time: 23,
};
const game1: PrivateGameInformation = {
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
    nbDifferences: 1,
};

export const DEFAULT_GAME: PrivateGameInformation[] = [game1];
