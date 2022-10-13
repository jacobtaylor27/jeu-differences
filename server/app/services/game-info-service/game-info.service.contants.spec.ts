import { GameInfo } from '@common/game-info';

const game1: GameInfo = {
    id: '0',
    thumbnail: 'image',
    idOriginalBmp: '0',
    idEditedBmp: '0',
    idDifferenceBmp: '0',
    soloScore: [],
    multiplayerScore: [],
    name: 'Alice',
    differenceRadius: 1,
    differences: [],
};

const game2: GameInfo = {
    id: '1',
    thumbnail: 'image',
    idOriginalBmp: '1',
    idEditedBmp: '1',
    idDifferenceBmp: '1',
    soloScore: [],
    multiplayerScore: [],
    name: 'Bob',
    differenceRadius: 1,
    differences: [],
};

const game3: GameInfo = {
    id: '2',
    thumbnail: 'image',
    idOriginalBmp: '2',
    idEditedBmp: '2',
    idDifferenceBmp: '2',
    soloScore: [],
    multiplayerScore: [],
    name: 'Sami',
    differenceRadius: 1,
    differences: [],
};

export const DEFAULT_GAMES: GameInfo[] = [game1, game2, game3];
