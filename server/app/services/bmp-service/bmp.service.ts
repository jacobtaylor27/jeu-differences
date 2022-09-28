import { DB_BMP_COLLECTION } from '@app/constants/database';
import { DatabaseService } from '@app/services/database-service/database.service';
import { IdGeneratorService } from '@app/services/id-generator-service/id-generator.service';
import { BmpMessage } from '@common/bmp-message';
import { Collection } from 'mongodb';
import { Service } from 'typedi';
@Service()
export class BmpService {
    constructor(private readonly databaseService: DatabaseService, private readonly idGeneratorService: IdGeneratorService) {}

    get collection(): Collection<BmpMessage> {
        return this.databaseService.database.collection(DB_BMP_COLLECTION);
    }
    async getAllBmps(): Promise<BmpMessage[]> {
        return await this.collection.find({}).toArray();
    }
    async getBmpById(bmpId: number): Promise<BmpMessage> {
        const filter = { id: bmpId };
        return (await this.collection.find(filter).toArray())[0];
    }
    async addBmp(bmp: BmpMessage): Promise<boolean> {
        try {
            bmp.id = await this.idGeneratorService.generateUniqueId();
            await this.collection.insertOne(bmp);
            return true;
        } catch (error) {
            return false;
        }
    }
    async deleteBmpById(bmpId: number): Promise<boolean> {
        const filter = { id: { $eq: bmpId } };
        return (await this.collection.findOneAndDelete(filter)).value !== null ? true : false;
    }
}
