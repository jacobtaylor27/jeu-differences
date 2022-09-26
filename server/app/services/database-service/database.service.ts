import { Db, MongoClient } from 'mongodb';
import { Service } from 'typedi';

const DB_USERNAME = 'admin';
const DB_PASSWORD = 'mpwqKiEIeOimdmr5';

const DB_URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.7njxiw7.mongodb.net/?retryWrites=true&w=majority`;
const DB_NAME = 'seven-differences';

@Service()
export class DatabaseService {
    private client: MongoClient;
    private db: Db;

    async start(url: string = DB_URL): Promise<void> {
        try {
            this.client = new MongoClient(url);
            await this.client.connect();
            this.db = this.client.db(DB_NAME);
        } catch (error) {
            throw new Error('La connection à mongoDb a échoué');
        }
    }
    async close(): Promise<void> {
        this.client.close();
    }
    async populateDatabase(collectionName: string, data: any): Promise<void> {
        const collection = this.client.db(DB_NAME).collection(collectionName);
        const documents = await collection.find({}).toArray();
        if (documents.length === 0) {
            await collection.insertMany(data);
        }
    }
    get database(): Db {
        return this.db;
    }
}
