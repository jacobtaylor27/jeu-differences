import { DB_GAME_COLLECTION } from '@app/constants/database';
import { DatabaseService } from '@app/services/database-service/database.service';
import { Game } from '@common/game';
import { Collection, ObjectId } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class GameService {
    constructor(private readonly databaseService: DatabaseService) {}

    get collection(): Collection<Game> {
        return this.databaseService.database.collection(DB_GAME_COLLECTION);
    }
    async getAllGames(): Promise<Game[]> {
        return await this.collection.find({}).toArray();
    }
    async getGameById(gameId: number): Promise<Game | undefined> {
        const filter = { _id: { $eq: new ObjectId(gameId) } };
        return (await this.collection.find(filter).toArray())[0];
    }
    async addGame(game: Game): Promise<void> {
        await this.collection.insertOne(game);
    }
    async deleteGameById(gameId: number): Promise<void> {
        const filter = { _id: { $eq: new ObjectId(gameId) } };
        await this.collection.findOneAndDelete(filter);
    }
}
