import { Game } from '@common/game';
import { GameCard } from '@common/game-card';
import { Service } from 'typedi';

@Service()
export class GameService {
    private game: Game[];

    constructor() {
        this.game = [];
    }

    async initialiseGames() {
        // TODO: fetch toutes les parties avec mongoDb
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
    getGameCardById(gameId: number): GameCard | undefined {
        const game: Game | undefined = this.getGameById(gameId);
        if (game !== undefined) {
            return this.convertGameIntoGameCard(game);
        } else {
            return undefined;
        }
    }
    async getAllGameCards() {
        const gameCards: GameCard[] = [];
        this.game.forEach((game) => {
            gameCards.push(this.convertGameIntoGameCard(game));
        });
        return gameCards;
    }
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
