import { DB_BMP_COLLECTION, DB_GAME_COLLECTION, DB_ID_COLLECTION, DB_NAME } from '@app/constants/database';
import { DEFAULT_BMP } from '@app/constants/default-bmp';
import { DEFAULT_GAME } from '@app/constants/default-game';
import { DEFAULT_ID } from '@app/constants/default-id';
import { Bmp } from '@common/bmp';
import { Game } from '@common/game';
import { Id } from '@common/id';
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
        this.db.createCollection(DB_GAME_COLLECTION);
        await this.initializeGameCollection(DB_GAME_COLLECTION, DEFAULT_GAME);
        await this.initializeIdCollection(DB_ID_COLLECTION, [{ id: DEFAULT_ID }]);
        await this.initializeBmpCollection(DB_BMP_COLLECTION, DEFAULT_BMP);
    }

    private async initializeGameCollection(collectionName: string, game: Game[]): Promise<void> {
        const collection = this.client.db(DB_NAME).collection(collectionName);
        const documents = await collection.find({}).toArray();
        if (documents.length === 0) {
            await collection.insertMany(game);
        }
    }

    private async initializeIdCollection(collectionName: string, baseId: Id[]): Promise<void> {
        const collection = this.client.db(DB_NAME).collection(collectionName);
        const documents = await collection.find({}).toArray();
        if (documents.length === 0) {
            await collection.insertMany(baseId);
        }
    }

    private async initializeBmpCollection(collectionName: string, bmp: Bmp[]): Promise<void> {
        const collection = this.client.db(DB_NAME).collection(collectionName);
        const documents = await collection.find({}).toArray();
        if (documents.length === 0) {
            await collection.insertMany(bmp);
        }
    }
}
