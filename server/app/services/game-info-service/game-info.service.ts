import { DB_GAME_COLLECTION } from '@app/constants/database';
import { DatabaseService } from '@app/services/database-service/database.service';
import { GameInfo } from '@common/game-info';
import { Collection } from 'mongodb';
import { Service } from 'typedi';
import { v4 } from 'uuid';

@Service()
export class GameService {
    constructor(private readonly databaseService: DatabaseService) {}

    get collection(): Collection<GameInfo> {
        return this.databaseService.database.collection(DB_GAME_COLLECTION);
    }

    async getAllGames(): Promise<GameInfo[]> {
        return await this.collection.find({}).toArray();
    }
    async getGameById(gameId: string): Promise<GameInfo> {
        const filter = { id: gameId };
        return (await this.collection.find(filter).toArray())[0];
    }

    async addGame(game: GameInfo): Promise<boolean> {
        try {
            game.id = v4();
            await this.collection.insertOne(game);
            return true;
        } catch (error) {
            return false;
        }
    }
    async deleteGameById(gameId: string): Promise<boolean> {
        const filter = { id: { $eq: gameId } };
        return (await this.collection.findOneAndDelete(filter)).value !== null ? true : false;
    }
}
