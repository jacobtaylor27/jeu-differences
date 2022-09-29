import { DB_BMP_COLLECTION, DB_GAME_COLLECTION, DB_ID_COLLECTION, DB_NAME, DB_URL } from '@app/constants/database';
import { DEFAULT_BMP } from '@app/constants/default-bmp';
import { DEFAULT_GAME } from '@app/constants/default-game-info';
import { DEFAULT_ID } from '@app/constants/default-id';
import { BmpMessage } from '@common/bmp-message';
import { GameInfo } from '@common/game-info';
import { Id } from '@common/id';
import { Db, MongoClient } from 'mongodb';
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
            throw new Error('La connection à mongoDb a échoué');
        }
        await this.populateDatabase();
    }

    async close(): Promise<void> {
        this.client.close();
    }

    async populateDatabase(): Promise<void> {
        this.db.createCollection(DB_GAME_COLLECTION);
        await this.initializeGameCollection(DB_GAME_COLLECTION, DEFAULT_GAME);
        await this.initializeIdCollection(DB_ID_COLLECTION, [{ id: DEFAULT_ID }]);
        await this.initializeBmpCollection(DB_BMP_COLLECTION, DEFAULT_BMP);
    }

    private async initializeGameCollection(collectionName: string, game: GameInfo[]): Promise<void> {
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

    private async initializeBmpCollection(collectionName: string, bmp: BmpMessage[]): Promise<void> {
        const collection = this.client.db(DB_NAME).collection(collectionName);
        const documents = await collection.find({}).toArray();
        if (documents.length === 0) {
            await collection.insertMany(bmp);
        }
    }
}
