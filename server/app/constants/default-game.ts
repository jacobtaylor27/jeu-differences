import { Game } from '@common/game';
import { Score } from '@common/score';

const score: Score = {
    playerName: 'Mark',
    time: 23,
};
const game1: Game = {
    id: 0,
    idOriginalBmp: 0,
    idEditedBmp: 0,
    idDifferenceBmp: 0,
    soloScore: [score],
    multiplayerScore: [score],
    name: 'Mark',
    differences: [],
};

export const DEFAULT_GAME: Game[] = [game1];
