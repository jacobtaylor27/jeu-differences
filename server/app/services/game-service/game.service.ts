import { Game } from '@common/game';
import { GameCard } from '@common/game-card';
import { Service } from 'typedi';

@Service()
export class GameService {
    async initialiseGames() {}
    async getGameById(gameId: number): Game {}
    async getGameCardById(gameId: number): GameCard {}
    async getAllGameCards() {}
    async addGame(game: Game): boolean {}
    async deleteGameById(gameId: number): Game | undefined {}
}
