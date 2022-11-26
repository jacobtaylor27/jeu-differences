import { CluesService } from '@app/services/clues-service/clues.service';
import { expect } from 'chai';
import { describe } from 'mocha';
import { Container } from 'typedi';

describe.only('EventMessage Service', () => {
    let cluesService: CluesService;

    beforeEach(() => {
        cluesService = Container.get(CluesService);
    });

    it('Should return the coordinate value if the user is using the third clue', () => {
        const pixelCoordinate = { x: 120, y: 400 };
        const expectedResult = [pixelCoordinate, { x: -1, y: -1 }];
        expect(cluesService.thirdCluePosition(pixelCoordinate)).to.deep.equal(expectedResult);
    });
});
