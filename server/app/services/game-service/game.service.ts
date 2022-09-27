import { DB_GAME_COLLECTION } from '@app/constants/database';
import { DatabaseService } from '@app/services/database-service/database.service';
import { Game } from '@common/game';
import { Collection } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class GameService {
    constructor(private readonly databaseService: DatabaseService) {}

    get collection(): Collection<Game> {
        return this.databaseService.database.collection(DB_GAME_COLLECTION);
    }
    async getAllGames(): Promise<Game[] | undefined> {
        return await this.collection.find({}).toArray();
    }
    async getGameById(gameId: number): Promise<Game | undefined> {
        const filter = { id: gameId };
        try {
            return await this.collection.find(filter).toArray()[0];
        } catch (error) {
            return undefined;
        }
    }
    async addGame(game: Game): Promise<boolean> {
        try {
            await this.collection.insertOne(game);
            return true;
        } catch (error) {
            return false;
        }
    }
    async deleteGameById(gameId: number): Promise<void> {
        const filter = { id: { $eq: gameId } };
        try {
            await this.collection.findOneAndDelete(filter);
        } catch (err) {
            throw new Error("Couldn't find and delete game");
        }
    }
}
