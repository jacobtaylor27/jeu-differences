import { DB_GAME_COLLECTION, DB_NAME } from '@app/constants/database';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as sinon from 'sinon';
import { DatabaseServiceMock } from './database.service.mock';
chai.use(chaiAsPromised);

describe.only('Database service', () => {
    let mongoServer: MongoMemoryServer;
    let databaseService: DatabaseServiceMock;
    let uri = '';

    beforeEach(async () => {
        databaseService = new DatabaseServiceMock();
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

    it('start(uri) should create a client and a database with a given name', async () => {
        await databaseService.start(uri);
        expect(databaseService['client']).to.not.equal(undefined);
        expect(databaseService.database.databaseName).to.equal(DB_NAME);
    });

    it('start() should create a client and a database with a given name', async () => {
        await databaseService.start();
        expect(databaseService['client']).to.not.equal(undefined);
        expect(databaseService.database.databaseName).to.equal(DB_NAME);
    });

    it("doesCollectionExists(collectionName) should return false if a collection doesn't exist", async () => {
        await databaseService.start();
        await expect(databaseService['doesCollectionExists'](DB_GAME_COLLECTION)).to.eventually.equal(false);
    });

    it('doesCollectionExists(collectionName) should return true if a collection does exist', async () => {
        await databaseService.start();
        await databaseService.populateDatabase();
        await expect(databaseService['doesCollectionExists'](DB_GAME_COLLECTION)).to.eventually.equal(true);
    });

    it('createCollection() should be called when there is no collection in the db', async () => {
        await databaseService.start();
        const spy = sinon.spy(databaseService['db'], 'createCollection');
        await databaseService.populateDatabase();
        expect(spy.calledOnce).to.equal(true);
    });

    it('createCollection() should not be called when a collection already exists', async () => {
        await databaseService.start();
        await databaseService.populateDatabase();
        const spy = sinon.spy(databaseService['db'], 'createCollection');
        await databaseService.populateDatabase();
        expect(spy.calledOnce).to.equal(false);
    });

    it('isCollectionEmpty(collectionName) should return true when the collection is empty', async () => {
        await databaseService.start();
        await expect(databaseService['isCollectionEmpty'](DB_GAME_COLLECTION)).to.eventually.equal(true);
    });

    it('isCollectionEmpty(collectionName) should return false after populating the db', async () => {
        await databaseService.start();
        await databaseService.populateDatabase();
        await expect(databaseService['isCollectionEmpty'](DB_GAME_COLLECTION)).to.eventually.equal(false);
    });

    it('initializeGameCollection() should be called when calling populateDatabase for the first time', async () => {
        await databaseService.start();
        const spy = sinon.spy(databaseService['initializeGameCollection']);
        await databaseService.populateDatabase();
        expect(spy.calledOnce).to.equal(true);
    });

    it('initializeGameCollection() should not be called when calling populateDatabase for a second time', async () => {
        await databaseService.start();
        await databaseService.populateDatabase();
        const spy = sinon.spy(databaseService['initializeGameCollection']);
        await databaseService.populateDatabase();
        expect(spy.calledOnce).to.equal(false);
    });

    it('The games in the db should correspond to the ones added ', async () => {});
});
