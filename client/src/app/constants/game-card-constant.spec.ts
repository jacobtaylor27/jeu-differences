import { GameCard } from '@app/interfaces/game-card';

export const multiGameCard: GameCard = {
    gameInformation: {
        id: '',
        name: '',
        thumbnail: '',
        idOriginalBmp: '',
        idEditedBmp: '',
        soloScore: [],
        multiplayerScore: [],
        nbDifferences: 3,
        isMulti: true,
    },
    isAdminCard: false,
    isMulti: true,
};

export const soloGameCard: GameCard = {
    gameInformation: {
        id: '',
        name: '',
        thumbnail: '',
        idOriginalBmp: '',
        idEditedBmp: '',
        soloScore: [],
        multiplayerScore: [],
        nbDifferences: 3,
        isMulti: false,
    },
    isAdminCard: false,
    isMulti: false,
};

export const adminGameCard: GameCard = {
    gameInformation: {
        id: '',
        name: '',
        thumbnail: '',
        idOriginalBmp: '',
        idEditedBmp: '',
        soloScore: [],
        multiplayerScore: [],
        nbDifferences: 3,
        isMulti: false,
    },
    isAdminCard: true,
    isMulti: false,
};

export const games: GameCard[] = [multiGameCard, soloGameCard, adminGameCard];
