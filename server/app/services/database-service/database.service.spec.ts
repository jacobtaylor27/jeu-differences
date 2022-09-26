import { expect } from 'chai';
import { Container } from 'typedi';
import { DatabaseService } from './database.service';

describe('Database service', () => {
    let databaseService: DatabaseService;

    beforeEach(async () => {
        databaseService = Container.get(DatabaseService);
    });

    it('Should return an empty array of data (TODO: implement the service later)', () => {
        expect(databaseService.getGames()).to.deep.equal([]);
    });
});
