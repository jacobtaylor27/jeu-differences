import { GameCard } from '@app/interfaces/game-card';

export const gameCard1: GameCard = {
    gameInformation: {
        id: '1',
        name: 'test',
        idOriginalBmp: 'imageName',
        idEditedBmp: '1',
        thumbnail: 'image',
        soloScore: [
            {
                playerName: 'test2',
                time: 10,
            },
            {
                playerName: 'test',
                time: 10,
            },
        ],
        multiplayerScore: [
            {
                playerName: 'test2',
                time: 10,
            },
            {
                playerName: 'test',
                time: 10,
            },
        ],
        nbDifferences: 1,
        isMulti: true,
    },
    isAdminCard: true,
    isMulti: true,
};
