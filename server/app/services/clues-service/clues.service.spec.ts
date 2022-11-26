import { CluesService } from '@app/services/clues-service/clues.service';
import { expect } from 'chai';
import { describe } from 'mocha';
import { Container } from 'typedi';

describe.only('Clues Service', () => {
    let cluesService: CluesService;

    beforeEach(() => {
        cluesService = Container.get(CluesService);
    });

    it('Should return the quadrant corners coordinates where the pixel is in the image on a scale of 1/4', () => {
        const pixelCoordinate = { x: 120, y: 400 };
        const expectedResult = [
            { x: 0, y: 240 },
            { x: 320, y: 480 },
        ];
        expect(cluesService.firstCluePosition(pixelCoordinate)).to.deep.equal(expectedResult);
    });

    it('Should return the coordinate value if the user is using the third clue', () => {
        const pixelCoordinate = { x: 120, y: 400 };
        const expectedResult = [pixelCoordinate, { x: -1, y: -1 }];
        expect(cluesService.thirdCluePosition(pixelCoordinate)).to.deep.equal(expectedResult);
    });
});
