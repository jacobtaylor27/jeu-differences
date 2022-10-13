import { DB_GAME_COLLECTION, DB_NAME, DB_URL } from '@app/constants/database';
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
        if (!this.client) {
            this.client = new MongoClient(url);
            await this.client.connect();
            this.db = this.client.db(DB_NAME);
        }
    }

    async close(): Promise<void> {
        this.client.close();
    }

    async initializeCollection(collectionName: string = DB_GAME_COLLECTION): Promise<void> {
        if (!(await this.doesCollectionExists(collectionName))) {
            await this.db.createCollection(collectionName);
        }
    }

    private async doesCollectionExists(collectionName: string): Promise<boolean> {
        return !((await this.db.listCollections({ name: collectionName }).toArray()).length === 0);
    }
}
