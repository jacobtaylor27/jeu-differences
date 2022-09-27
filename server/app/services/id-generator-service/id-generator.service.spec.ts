import { DB_URL } from '@app/constants/database';
import { DatabaseServiceMock } from '@app/services/database-service/database.service.mock';
import { IdGeneratorService } from '@app/services/id-generator-service/id-generator.service';
import { expect } from 'chai';
import { describe } from 'mocha';

describe('Id generator service', async () => {
    let idGeneratorService: IdGeneratorService;
    let databaseService: DatabaseServiceMock;

    beforeEach(async () => {
        databaseService = new DatabaseServiceMock();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        idGeneratorService = new IdGeneratorService(databaseService as any);
        await databaseService.start(DB_URL);
        await databaseService.populateDatabase();
    });

    afterEach(async () => {
        await databaseService.close();
    });

    it('generateUniqueId() should generate unique ids', async () => {
        const expectedId = 1;
        expect(await idGeneratorService.generateUniqueId()).to.equal(expectedId);

        const expectedId2 = 2;
        expect(await idGeneratorService.generateUniqueId()).to.equal(expectedId2);

        const expectedId3 = 3;
        expect(await idGeneratorService.generateUniqueId()).to.equal(expectedId3);
    });
});
