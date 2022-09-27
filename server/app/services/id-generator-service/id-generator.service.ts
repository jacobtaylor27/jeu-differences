import { DB_ID_COLLECTION } from '@app/constants/database';
import { DatabaseService } from '@app/services/database-service/database.service';
import { Id } from '@common/id';
import { Collection } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class IdGeneratorService {
    constructor(private readonly databaseService: DatabaseService) {}

    async generateUniqueId(): Promise<void> {
        let uniqueId = await this.getLastGeneratedId();
        uniqueId++;
        await this.updateLastGeneratedId(uniqueId);
    }

    private async getLastGeneratedId(): Promise<number> {
        return (await this.getCollection()).find({}).toArray()[0];
    }

    private async updateLastGeneratedId(lastGeneratedId: number): Promise<void> {
        const updatedId = { id: lastGeneratedId };
        await (await this.getCollection()).updateOne({}, updatedId);
    }

    private async getCollection(): Promise<Collection<Id>> {
        return this.databaseService.database.collection(DB_ID_COLLECTION);
    }
}
