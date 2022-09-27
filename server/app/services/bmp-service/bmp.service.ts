import { DB_BMP_COLLECTION } from '@app/constants/database';
import { DatabaseService } from '@app/services/database-service/database.service';
import { Bmp } from '@common/bmp';
import { Collection } from 'mongodb';
import { Service } from 'typedi';
@Service()
export class BmpService {
    constructor(private readonly databaseService: DatabaseService) {}

    get collection(): Collection<Bmp> {
        return this.databaseService.database.collection(DB_BMP_COLLECTION);
    }
    async getAllBmps(): Promise<Bmp[]> {
        return await this.collection.find({}).toArray();
    }
    async getBmpById(bmpId: number): Promise<Bmp> {
        const filter = { id: bmpId };
        return (await this.collection.find(filter).toArray())[0];
    }
    async addBmp(bmp: Bmp): Promise<boolean> {
        try {
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
