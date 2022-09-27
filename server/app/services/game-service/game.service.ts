import { DB_GAME_COLLECTION } from '@app/constants/database';
import { DatabaseService } from '@app/services/database-service/database.service';
import { IdGeneratorService } from '@app/services/id-generator-service/id-generator.service';
import { Game } from '@common/game';
import { Collection } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class GameService {
    constructor(private readonly databaseService: DatabaseService, private readonly idGeneratorService: IdGeneratorService) {}

    get collection(): Collection<Game> {
        return this.databaseService.database.collection(DB_GAME_COLLECTION);
    }
    async getAllGames(): Promise<Game[]> {
        return await this.collection.find({}).toArray();
    }
    async getGameById(gameId: number): Promise<Game> {
        const filter = { id: gameId };
        return (await this.collection.find(filter).toArray())[0];
    }
    async addGame(game: Game): Promise<boolean> {
        try {
            game.id = await this.idGeneratorService.generateUniqueId();
            await this.collection.insertOne(game);
            return true;
        } catch (error) {
            return false;
        }
    }
    async deleteGameById(gameId: number): Promise<boolean> {
        const filter = { id: { $eq: gameId } };
        return (await this.collection.findOneAndDelete(filter)).value !== null ? true : false;
    }
}
