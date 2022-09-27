import { DatabaseService } from '@app/services/database-service/database.service';
import { Game } from '@common/game';
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
}
