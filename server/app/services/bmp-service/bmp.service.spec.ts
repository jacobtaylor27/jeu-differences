import { DB_URL } from '@app/constants/database';
import { DEFAULT_BMP } from '@app/constants/default-bmp';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { DatabaseServiceMock } from '@app/services/database-service/database.service.mock';
import { expect } from 'chai';

describe('Bmp service', async () => {
    let bmpService: BmpService;
    let databaseService: DatabaseServiceMock;

    beforeEach(async () => {
        databaseService = new DatabaseServiceMock();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bmpService = new BmpService(databaseService as any);
        await databaseService.start(DB_URL);
        await databaseService.populateDatabase();
    });

    afterEach(async () => {
        await databaseService.close();
    });

    it('getBmpById(id) should return a bmp according to a specific id', async () => {
        expect(await bmpService.getBmpById(0)).to.deep.equals(DEFAULT_BMP[0]);
    });

    it('getBmpById(id) should return undefined if the specific id is out of range', async () => {});

    it('getAllBmp() should return all of the bmps', async () => {});

    it('addBmp(bmp) should add a bmp to the bmp collection, getAllBmps() should return them', async () => {});

    it("addBmp(bmp) shouldn't add a bmp twice", async () => {});

    it('deleteBmpBy(id) should delete a bmp according to a specific id', async () => {});

    it('deleteBmpBy(id) should return false when trying to delete the same bmp twice', async () => {});
});
