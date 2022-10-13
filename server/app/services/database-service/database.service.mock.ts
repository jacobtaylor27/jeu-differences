import { DB_GAME_COLLECTION, DB_NAME } from '@app/constants/database';
import { DEFAULT_GAME } from '@app/constants/default-game-info';
import { PrivateGameInformation } from '@app/interface/game-info';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
export class DatabaseServiceMock {
    private mongoServer: MongoMemoryServer;
    private client: MongoClient;
    private db: Db;

    get database(): Db {
        return this.db;
    }

    // eslint-disable-next-line no-unused-vars
    async start(url?: string): Promise<MongoClient> {
        if (!this.client) {
            this.mongoServer = await MongoMemoryServer.create();
            const mongoUri = this.mongoServer.getUri();
            this.client = new MongoClient(mongoUri);
            await this.client.connect();
            this.db = this.client.db(DB_NAME);
        }
        return this.client;
    }

    async close(): Promise<void> {
        if (this.client) {
            return this.client.close();
        } else {
            return Promise.resolve();
        }
    }
    async populateDatabase(): Promise<void> {
        const collections = await this.db.listCollections({ name: DB_GAME_COLLECTION }).toArray();
        if (collections.length === 0) {
            await this.db.createCollection(DB_GAME_COLLECTION);
        }
        if ((await this.db.collection(DB_GAME_COLLECTION).countDocuments()) === 0) {
            await this.initializeGameCollection(DB_GAME_COLLECTION, DEFAULT_GAME);
        }
    }

    private async initializeGameCollection(collectionName: string, game: PrivateGameInformation[]): Promise<void> {
        await this.client.db(DB_NAME).collection(collectionName).insertMany(game);
    }
}
