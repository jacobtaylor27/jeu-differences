import { IdGeneratorService } from '@app/services/id-generator-service/id-generator.service';
import { expect } from 'chai';
import { describe } from 'mocha';
import Container from 'typedi';

describe('GameInfo service', async () => {
    let idGeneratorService: IdGeneratorService;

    beforeEach(async () => {
        idGeneratorService = Container.get(IdGeneratorService);
    });

    it('getAllGame() should return all of the games', async () => {
        const nbIds = 10;
        const ids: string[] = [];
        for (let i = 0; i < nbIds; i++) {
            ids.push(await idGeneratorService.getNewId());
        }

        for (const id of ids) {
            expect(ids.includes(id)).to.equal();
        }
    });
});
