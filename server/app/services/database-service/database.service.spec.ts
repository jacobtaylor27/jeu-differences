import { DB_GAME_COLLECTION, DB_NAME } from '@app/constants/database';
import { DatabaseService } from '@app/services/database-service/database.service';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as sinon from 'sinon';
chai.use(chaiAsPromised);

describe('Database service', () => {
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
        await databaseService.initializeCollection();
        await expect(databaseService['doesCollectionExists'](DB_GAME_COLLECTION)).to.eventually.equal(true);
    });

    it('createCollection() should be called when there is no collection in the db', async () => {
        await databaseService.start();
        const spy = sinon.spy(databaseService['db'], 'createCollection');
        await databaseService.initializeCollection();
        expect(spy.calledOnce).to.equal(true);
    });

    it('createCollection() should not be called when a collection already exists', async () => {
        await databaseService.start();
        await databaseService.initializeCollection();
        const spy = sinon.spy(databaseService['db'], 'createCollection');
        await databaseService.initializeCollection();
        expect(spy.calledOnce).to.equal(false);
    });

    it('initializeCollection(collectionName) should let the user choose the collectionName', async () => {
        const collectionName = 'test-to-delete-collection';
        await databaseService.start();
        const spy = sinon.spy(databaseService['db'], 'createCollection');
        await databaseService.initializeCollection(collectionName);
        expect(spy.calledOnce).to.equal(true);
    });

    it('initializeCollection(collectionName) should not call createCollection twice when a collection is created', async () => {
        const collectionName = 'test-to-delete-collection';
        await databaseService.start();
        await databaseService.initializeCollection(collectionName);
        const spy = sinon.spy(databaseService['db'], 'createCollection');
        await databaseService.initializeCollection(collectionName);
        expect(spy.calledOnce).to.equal(false);
    });
});
