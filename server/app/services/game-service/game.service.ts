import { Game } from '@common/game';
import { GameCard } from '@common/game-card';
import { Service } from 'typedi';

@Service()
export class GameService {
    async getGameById(gameId: number): Promise<Game> {
        // TODO: fetch the rest of the data with mongoDb
        const game: Game = {
            id: gameId
            idOriginalBmp: number;
            idEditedBmp: number;
            bestTimes: string;
            name: string;
            differences: string;
        };
        return game;
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
