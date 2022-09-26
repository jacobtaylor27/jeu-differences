import { DatabaseService } from '@app/services/database-service/database.service';
import { expect } from 'chai';
import { MongoMemoryServer } from 'mongodb-memory-server';

const COLLECTION_NAME = 'highscores';
const DB_NAME = 'seven-differences';

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
    });

    it('start(uri) should allow the connection to the database', async () => {
        await databaseService.start(uri);
        expect(databaseService['client']).to.not.equal(undefined);
        expect(databaseService['db'].databaseName).to.equal(DB_NAME);
    });

    it('start() should also allow the connection to the database ', async () => {
        await databaseService.start(uri);
        expect(databaseService['client']).to.not.equal(undefined);
        expect(databaseService['db'].databaseName).to.equal(DB_NAME);
    });

    it('start(uri) should throw an exception given a bad uri', async () => {
        const badUri = 'badUri00';
        try {
            await databaseService.start(badUri);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });

    it('populateDatabase(...) should allow to populate the database with a collection', async () => {
        const contact1 = { id: 1, name: 'Test', email: 'a@b.ca', message: 'test' };
        const contact2 = { id: 2, name: 'Test', email: 'a@b.ca', message: 'test' };
        const contacts = [contact1, contact2];

        await databaseService.start(uri);
        await databaseService.database.createCollection(COLLECTION_NAME);
        await databaseService.populateDatabase(COLLECTION_NAME, contacts);
        const insertedContacts = await databaseService.database.collection(COLLECTION_NAME).find({}).toArray();

        expect(insertedContacts.length).to.equal(2);
        insertedContacts.forEach((contact, index) => {
            expect(contacts[index].email).to.be.equal(contact.email);
            expect(contacts[index].id).to.be.equal(contact.id);
            expect(contacts[index].message).to.be.equal(contact.message);
            expect(contacts[index].name).to.be.equal(contact.name);
        });
    });

    it('populateDatabase(...) should not populate a collection if data exists', async () => {
        const contact1 = { id: 1, name: 'Test', email: 'a@b.ca', message: 'test' };
        const contact2 = { id: 2, name: 'Test', email: 'a@b.ca', message: 'test' };

        await databaseService.start(uri);
        await databaseService.database.createCollection(COLLECTION_NAME);
        await databaseService.database.collection(COLLECTION_NAME).insertOne(contact1);
        await databaseService.populateDatabase(COLLECTION_NAME, [contact1, contact2]);
        const insertedContacts = await databaseService.database.collection(COLLECTION_NAME).find({}).toArray();
        expect(insertedContacts.length).equal(1);
    });
});
