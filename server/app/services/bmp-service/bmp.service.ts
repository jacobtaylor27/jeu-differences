import { DB_BMP_COLLECTION } from '@app/constants/database';
import { DatabaseService } from '@app/services/database-service/database.service';
import { BmpMessage } from '@common/bmp-message';
import { Collection } from 'mongodb';
import { Service } from 'typedi';
import { v4 } from 'uuid';
@Service()
export class BmpService {
    constructor(private readonly databaseService: DatabaseService) {}

    get collection(): Collection<BmpMessage> {
        return this.databaseService.database.collection(DB_BMP_COLLECTION);
    }
    async getAllBmps(): Promise<BmpMessage[]> {
        return await this.collection.find({}).toArray();
    }
    async getBmpById(bmpId: string): Promise<BmpMessage> {
        const filter = { id: bmpId };
        return (await this.collection.find(filter).toArray())[0];
    }
    async addBmp(bmp: BmpMessage): Promise<boolean> {
        try {
            bmp.id = v4();
            await this.collection.insertOne(bmp);
            return true;
        } catch (error) {
            return false;
        }
    }
    async deleteBmpById(bmpId: string): Promise<boolean> {
        const filter = { id: { $eq: bmpId } };
        return (await this.collection.findOneAndDelete(filter)).value !== null ? true : false;
    }
}
