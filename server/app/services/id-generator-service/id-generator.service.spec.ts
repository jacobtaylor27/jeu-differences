import { IdGeneratorService } from '@app/services/id-generator-service/id-generator.service';
import { expect } from 'chai';
import { describe } from 'mocha';
import { Container } from 'typedi';

describe('IdGenerator Service', () => {
    let idGeneratorService: IdGeneratorService;

    beforeEach(() => {
        idGeneratorService = Container.get(IdGeneratorService);
    });

    it('generateNewId() should generate an id', () => {
        expect(idGeneratorService.generateNewId()).to.be.instanceOf('string');
    });
});
