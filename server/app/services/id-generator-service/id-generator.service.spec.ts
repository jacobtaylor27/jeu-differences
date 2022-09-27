import { DB_URL } from '@app/constants/database';
import { DatabaseServiceMock } from '@app/services/database-service/database.service.mock';
import { IdGeneratorService } from '@app/services/id-generator-service/id-generator.service';
import { expect } from 'chai';
import { describe } from 'mocha';

describe('Id service', async () => {
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
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const expectedId = [1, 2, 3, 4, 5];
        expectedId.forEach(async (id) => {
            expect(await idGeneratorService.generateUniqueId()).to.equal(id);
        });
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const expectedId2 = [6, 7, 8, 9, 10];
        expectedId2.forEach(async (id) => {
            expect(await idGeneratorService.generateUniqueId()).to.equal(id);
        });
    });
});
