import { DB_GAME_COLLECTION, DB_NAME, DB_URL } from '@app/constants/database';
import { DEFAULT_GAME } from '@app/constants/default-game-info';
import { GameInfo } from '@common/game-info';
import { Db, MongoClient, MongoParseError } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class DatabaseService {
    private client: MongoClient;
    private db: Db;

    get database(): Db {
        return this.db;
    }

    async start(url: string = DB_URL): Promise<void> {
        try {
            this.client = new MongoClient(url);
            await this.client.connect();
            this.db = this.client.db(DB_NAME);
        } catch (error) {
            throw new MongoParseError(error);
        }
        await this.populateDatabase();
    }

    async close(): Promise<void> {
        this.client.close();
    }

    async populateDatabase(): Promise<void> {
        if (!(await this.doesCollectionExists(DB_GAME_COLLECTION))) {
            await this.db.createCollection(DB_GAME_COLLECTION);
        }
        if (await this.isCollectionEmpty(DB_GAME_COLLECTION)) {
            await this.initializeGameCollection(DB_GAME_COLLECTION, DEFAULT_GAME);
        }
    }

    private async doesCollectionExists(collectionName: string): Promise<boolean> {
        return (await this.db.listCollections({ name: collectionName }).toArray()).length === 0;
    }

    private async isCollectionEmpty(collectionName: string): Promise<boolean> {
        return (await this.db.collection(collectionName).countDocuments()) === 0;
    }

    private async initializeGameCollection(collectionName: string, game: GameInfo[]): Promise<void> {
        await this.client.db(DB_NAME).collection(collectionName).insertMany(game);
    }
}
