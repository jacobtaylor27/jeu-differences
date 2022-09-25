import { Game } from '@common/game';
import { GameCard } from '@common/game-card';
import { Service } from 'typedi';

@Service()
export class GameService {
    private game: Game[];

    constructor() {
        // TODO: fetch toutes les parties avec MongoDb
        this.game = [];
        const basicGame: Game = {
            id: 0,
            idOriginalBmp: 0,
            idEditedBmp: 0,
            bestTimes: '',
            name: 'firstGame',
            differences: '',
        };
        this.game.push(basicGame);
    }
    getGameById(gameId: number): Game | undefined {
        for (const game of this.game) {
            if (game.id === gameId) {
                return game;
            }
        }
        return undefined;
    }
    async getGameCardById(gameId: number) {
        const game: Game = await this.getGameById(gameId);
        return this.convertGameIntoGameCard(game);
    }
    async getAllGameCards() {}
    async addGame() {}

    private convertGameIntoGameCard(game: Game): GameCard {
        const gameCard: GameCard = {
            id: game.id,
            idOriginalBmp: game.idOriginalBmp,
            bestTimes: game.bestTimes,
            name: game.name,
        };
        return gameCard;
    }
}
