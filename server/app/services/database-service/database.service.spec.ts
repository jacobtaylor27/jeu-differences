import { DB_GAME_COLLECTION, DB_NAME } from '@app/constants/database';
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

    it('There should be no client before starting the db', async () => {
        expect(databaseService['client']).to.equal(undefined);
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

    it('start() should return the current object', async () => {});

    it('initializeGameCollection() should be called when first intialized the game collection', async () => {
        await databaseService.start();
        const spy = sinon.spy(Object.getPrototypeOf(databaseService), 'initializeGameCollection');
        await databaseService.start();
        expect(spy.calledOnce).to.equal(false);
    });

    it("doesCollectionExists(collectionName) should return false if the collection doesn't exist", async () => {});

    it('doesCollectionExists(collectionName) should return true if the collection does exist', async () => {
        await databaseService.start();
        await databaseService.populateDatabase();
        await expect(databaseService['doesCollectionExists'](DB_GAME_COLLECTION)).to.eventually.equal(true);
    });

    it('createCollection() should be called when starting the database for the first time', async () => {
        await databaseService.start();
        const spy = sinon.spy(databaseService['db'], 'createCollection');
        await databaseService.populateDatabase();
        expect(spy.calledOnce).to.equal(true);
    });

    it('createCollection() should not be called when starting the database for the second time', async () => {});

    it('initializeGameCollection() should be called when starting the database for the first time', async () => {});

    it('initializeGameCollection() should not be called when starting the database for a second time', async () => {});

    it("isCollectionEmpty(collectionName) should return true if the collection doesn't contain documents", async () => {});

    it('isCollectionEmpty(collectionName) should return false if the collection contains documents', async () => {});

    it('The games in the db should correspond to the ones added ', async () => {});
});
