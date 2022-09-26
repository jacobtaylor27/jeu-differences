import { DatabaseService } from '@app/services/database-service/database.service';
import { expect } from 'chai';
import { MongoMemoryServer } from 'mongodb-memory-server';

const COLLECTION_NAME = 'highscores';

describe('Database service', () => {
    let mongoServer: MongoMemoryServer;
    let databaseService: DatabaseService = new DatabaseService();
    let uri = '';

    beforeEach(async () => {
        mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
    });

    afterEach(() => {
        databaseService.client.close();
        mongoServer.stop();
    });

    it('should connect to the database', async () => {
        await databaseService.start(uri);
        expect(databaseService.client).not.to.be.undefined;
    });

    it('should populate a collection', async () => {
        const contact1 = { id: 1, name: 'Test', email: 'a@b.ca', message: 'test' };
        const contact2 = { id: 2, name: 'Test', email: 'a@b.ca', message: 'test' };

        await databaseService.start(uri);
        await databaseService.db.createCollection(COLLECTION_NAME);
        await databaseService.populateDatabase(COLLECTION_NAME, [contact1, contact2]);
        const insertedContacts = await databaseService.db.collection(COLLECTION_NAME).find({}).toArray();
        expect(insertedContacts.length).to.equal(2);
        expect(insertedContacts).to.equal([contact1, contact2]);
    });

    it('should not populate a collection if data exists', async () => {
        const contact1 = { id: 1, name: 'Test', email: 'a@b.ca', message: 'test' };
        const contact2 = { id: 2, name: 'Test', email: 'a@b.ca', message: 'test' };

        await databaseService.start(uri);
        await databaseService.db.createCollection(COLLECTION_NAME);
        await databaseService.db.collection(COLLECTION_NAME).insertOne(contact1);
        await databaseService.populateDatabase(COLLECTION_NAME, [contact1, contact2]);
        const insertedContacts = await databaseService.db.collection(COLLECTION_NAME).find({}).toArray();
        expect(insertedContacts.length).equal(1);
        expect(insertedContacts).equal([contact1]);
    });
});
