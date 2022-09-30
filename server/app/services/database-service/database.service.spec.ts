import { DB_NAME } from '@app/constants/database';
import { DatabaseService } from '@app/services/database-service/database.service';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoParseError } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
chai.use(chaiAsPromised);

describe.only('Database service', () => {
    let mongoServer: MongoMemoryServer;
    let databaseService: DatabaseService;
    let uri = '';

    beforeEach(async () => {
        databaseService = new DatabaseService();
        mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
    });

    afterEach(async () => {
        if (databaseService['client']) {
            await databaseService.close();
        }
    });

    it('start(uri) should allow the connection to the database', async () => {
        await databaseService.start(uri);
        expect(databaseService['client']).to.not.equal(undefined);
        expect(databaseService.database.databaseName).to.equal(DB_NAME);
    });

    it('start() should also allow the connection to the database ', async () => {
        await databaseService.start();
        expect(databaseService['client']).to.not.equal(undefined);
        expect(databaseService.database.databaseName).to.equal(DB_NAME);
    });

    it('start(uri) should throw an exception given a bad uri', async () => {
        const badUri = 'badUri00';
        await expect(databaseService.start(badUri)).to.eventually.be.rejectedWith(Error).to.be.instanceof(MongoParseError);
    });
});
