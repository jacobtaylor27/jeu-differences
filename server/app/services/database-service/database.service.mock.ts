import { DB_GAME_COLLECTION, DB_NAME } from '@app/constants/database';
import { DEFAULT_GAME } from '@app/constants/default-game-info';
import { GameInfo } from '@common/game-info';
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
        if (!(await this.doesCollectionExists(DB_GAME_COLLECTION))) {
            await this.db.createCollection(DB_GAME_COLLECTION);
        }
        if (await this.isCollectionEmpty(DB_GAME_COLLECTION)) {
            await this.initializeGameCollection(DB_GAME_COLLECTION, DEFAULT_GAME);
        }
    }

    private async doesCollectionExists(collectionName: string): Promise<boolean> {
        return !((await this.db.listCollections({ name: collectionName }).toArray()).length === 0);
    }

    private async isCollectionEmpty(collectionName: string): Promise<boolean> {
        return (await this.db.collection(collectionName).countDocuments()) === 0;
    }

    private async initializeGameCollection(collectionName: string, game: GameInfo[]): Promise<void> {
        await this.client.db(DB_NAME).collection(collectionName).insertMany(game);
    }
}
