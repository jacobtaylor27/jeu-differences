import { DB_ID_COLLECTION } from '@app/constants/database';
import { DatabaseService } from '@app/services/database-service/database.service';
import { Id } from '@common/id';
import { Collection } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class IdGeneratorService {
    constructor(private readonly databaseService: DatabaseService) {}

    async generateUniqueId(): Promise<number> {
        const oldId = await this.getLastGeneratedId();
        let newId = oldId;
        newId++;
        await this.updateLastGeneratedId(oldId, newId);
        return newId;
    }

    private async getLastGeneratedId(): Promise<number> {
        const element = await (await this.getCollection()).find({}).toArray()[0];
        return element[0].id;
    }

    private async updateLastGeneratedId(lastGeneratedId: number, newId: number): Promise<void> {
        const filter = { id: lastGeneratedId };
        const update = { id: newId };
        const collection = await this.getCollection();
        await collection.updateOne({ filter }, update);
    }

    private async getCollection(): Promise<Collection<Id>> {
        return this.databaseService.database.collection(DB_ID_COLLECTION);
    }
}
