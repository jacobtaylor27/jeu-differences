import { DB_URL } from '@app/constants/database';
import { DEFAULT_BMP } from '@app/constants/default-bmp';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { DatabaseServiceMock } from '@app/services/database-service/database.service.mock';
import { IdGeneratorService } from '@app/services/id-generator-service/id-generator.service';
import { Bmp } from '@common/bmp';
import { expect } from 'chai';
import { describe } from 'mocha';

describe('Bmp service', async () => {
    let bmpService: BmpService;
    let databaseService: DatabaseServiceMock;
    let idGeneratorService: IdGeneratorService;

    beforeEach(async () => {
        databaseService = new DatabaseServiceMock();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        idGeneratorService = new IdGeneratorService(databaseService as any);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bmpService = new BmpService(databaseService as any, idGeneratorService);
        await databaseService.start(DB_URL);
        await databaseService.populateDatabase();
    });

    afterEach(async () => {
        await databaseService.close();
    });

    it('getBmpById(id) should return a bmp according to a specific id', async () => {
        expect(await bmpService.getBmpById(0)).to.deep.equal(DEFAULT_BMP[0]);
    });

    it('getBmpById(id) should return undefined if the specific id is out of range', async () => {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(await bmpService.getBmpById(5)).to.deep.equal(undefined);
    });

    it('getAllBmp() should return all of the bmps', async () => {
        expect((await bmpService.getAllBmps()).length).to.equal(DEFAULT_BMP.length);
        expect(await bmpService.deleteBmpById(0)).to.equal(true);
        expect(await bmpService.getAllBmps()).to.deep.equal([]);
    });

    it('addBmp(bmp) should add a bmp to the bmp collection, getAllBmps() should return them', async () => {
        const bmp: Bmp = {
            id: 1,
            name: 'deuxième image',
            file: 'asdfasdf',
        };
        expect((await bmpService.getAllBmps()).length).to.equal(DEFAULT_BMP.length);
        expect(await bmpService.addBmp(bmp)).to.equal(true);
        expect((await bmpService.getAllBmps()).length).to.equal(DEFAULT_BMP.length + 1);
    });

    it('addBmp(bmp) should add a bmp with a new id everytime', async () => {
        const bmp: Bmp = {
            name: 'deuxième image',
            file: 'asdfasdf',
        };
        const expectedId = 1;
        expect(await bmpService.addBmp(bmp)).to.equal(true);
        expect((await bmpService.getBmpById(expectedId))?.id).to.equal(expectedId);

        const bmp2: Bmp = {
            name: 'troisième image',
            file: 'anotherone',
        };
        const expectedId2 = 2;
        expect(await bmpService.addBmp(bmp2)).to.equal(true);
        expect((await bmpService.getBmpById(expectedId2))?.id).to.equal(expectedId2);
    });

    it("addBmp(bmp) shouldn't add a bmp twice", async () => {
        const bmp: Bmp = {
            id: 2,
            name: 'troisième image',
            file: '123 321*()@#$',
        };
        expect((await bmpService.getAllBmps()).length).to.equal(DEFAULT_BMP.length);
        expect(await bmpService.addBmp(bmp)).to.equal(true);
        expect(await bmpService.addBmp(bmp)).to.equal(false);
        expect((await bmpService.getAllBmps()).length).to.equal(DEFAULT_BMP.length + 1);
    });

    it('deleteBmpBy(id) should delete a bmp according to a specific id', async () => {
        expect(await bmpService.deleteBmpById(0)).to.equal(true);
        expect((await bmpService.getAllBmps()).length).to.equal(0);
    });

    it('deleteBmpBy(id) should return false when trying to delete the same bmp twice', async () => {
        expect(await bmpService.deleteBmpById(0)).to.equal(true);
        expect((await bmpService.getAllBmps()).length).to.equal(0);
        expect(await bmpService.deleteBmpById(0)).to.equal(false);
        expect(await bmpService.deleteBmpById(0)).to.equal(false);
    });
});
