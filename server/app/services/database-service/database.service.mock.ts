import { DB_NAME } from '@app/constants/database';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

export class DatabaseServiceMock {
    mongoServer: MongoMemoryServer;
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
        return;
    }
}
