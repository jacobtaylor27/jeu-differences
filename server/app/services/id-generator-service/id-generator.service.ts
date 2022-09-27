import { DB_ID_COLLECTION } from '@app/constants/database';
import { DatabaseService } from '@app/services/database-service/database.service';
import { Id } from '@common/id';
import { Collection } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class IdGeneratorService {
    constructor(private readonly databaseService: DatabaseService) {}

    async generateUniqueId(): Promise<number> {
        const oldId: number = (await this.getLastGeneratedId())[0].id;
        let newId = oldId;
        newId++;
        await this.updateLastGeneratedId(oldId, newId);
        return newId;
    }

    private async getLastGeneratedId(): Promise<Id[]> {
        const element: Id[] = await (await this.getCollection()).find({}).toArray();
        return element;
    }

    private async updateLastGeneratedId(lastGeneratedId: number, newId: number): Promise<number> {
        const update = {
            $set: { id: newId },
        };
        const collection = await this.getCollection();
        return (await collection.updateOne({}, update)).modifiedCount;
    }

    private async getCollection(): Promise<Collection<Id>> {
        return this.databaseService.database.collection(DB_ID_COLLECTION);
    }
}
