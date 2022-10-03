import { DB_NAME } from '@app/constants/database';
import { DatabaseService } from '@app/services/database-service/database.service';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoParseError } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as sinon from 'sinon';
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
        sinon.restore();
    });

    it('initializeGameCollection() should be called when first intialized the game collection', async () => {
        await databaseService.start();
        const spy = sinon.spy(Object.getPrototypeOf(databaseService), 'initializeGameCollection');
        await databaseService.start();
        expect(spy.calledOnce).to.equal(false);
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

    it('populateDatabase() should populate the database correctly', async () => {
        const spy = sinon.spy(databaseService, 'populateDatabase');
        await databaseService.start();
        expect(spy.calledOnce).to.equal(true);
    });
});
