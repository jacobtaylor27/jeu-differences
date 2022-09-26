import { DatabaseService } from '@app/services/database-service/database.service';
import { Game } from '@common/game';
import { GameCard } from '@common/game-card';
import { Service } from 'typedi';

@Service()
export class GameService {
    private game: Game[];

    constructor(private readonly databaseService: DatabaseService) {
        this.game = [];
    }
    async initialiseGames(): Promise<void> {
        this.game = this.databaseService.getGames();
    }
    async getAllGames(): Promise<Game[]> {
        return this.game;
    }
    async getGameById(gameId: number): Promise<Game | undefined> {
        for (const game of await this.getAllGames()) {
            if (game.id === gameId) {
                return game;
            }
        }
        return undefined;
    }
    async getGameCardById(gameId: number): Promise<GameCard | undefined> {
        const game: Game | undefined = await this.getGameById(gameId);
        if (game !== undefined) {
            return this.convertGameIntoGameCard(game);
        } else {
            return undefined;
        }
    }
    async getAllGameCards(): Promise<GameCard[]> {
        const gameCards: GameCard[] = [];
        const games: Game[] = await this.getAllGames();
        games.forEach((game) => {
            this.convertGameIntoGameCard(game).then((gameCard) => {
                gameCards.push(gameCard);
            });
        });
        return gameCards;
    }
    async addGame(game: Game): Promise<boolean> {
        if (!(await this.doesGameAlreadyExists(game.id))) {
            (await this.getAllGames()).push(game);
            return true;
        }
        return false;
    }
    async deleteGameById(gameId: number): Promise<Game | undefined> {
        const currentGames = await this.getAllGames();
        for (let i = 0; i < currentGames.length; i++) {
            if (currentGames[i].id === gameId) {
                const nbOfElementToDelete = 1;
                return currentGames.splice(i, nbOfElementToDelete)[0];
            }
        }
        return undefined;
    }
    private async doesGameAlreadyExists(gameId: number): Promise<boolean> {
        for (const game of await this.getAllGames()) {
            if (game.id === gameId) {
                return true;
            }
        }
        return false;
    }
    private async convertGameIntoGameCard(game: Game): Promise<GameCard> {
        const gameCard: GameCard = {
            id: game.id,
            idOriginalBmp: game.idOriginalBmp,
            bestScores: game.bestScores,
            name: game.name,
        };
        return gameCard;
    }
}
