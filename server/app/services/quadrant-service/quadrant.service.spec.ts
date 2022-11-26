import { FindQuadrantService } from '@app/services/quadrant-service/quadrant.service';
import { expect } from 'chai';
import { describe } from 'mocha';
import { Container } from 'typedi';

describe.only('EventMessage Service', () => {
    let findQuadrantService: FindQuadrantService;

    beforeEach(() => {
        findQuadrantService = Container.get(FindQuadrantService);
    });

    it('Should return the position of a pixel if its to the right or to the left ', () => {
        const leftUpperCoord = { x: 320, y: 240 };
        const rightBottomCoord = { x: 640, y: 480 };
        const rightPixelCoordinate = { x: 500, y: 300 };
        const leftPixelCoordinate = { x: 350, y: 300 };
        expect(findQuadrantService['isToTheRight'](rightPixelCoordinate, leftUpperCoord.x, rightBottomCoord.x)).to.equal(true);
        expect(findQuadrantService['isToTheRight'](leftPixelCoordinate, leftUpperCoord.x, rightBottomCoord.x)).to.equal(false);
    });

    it('Should return the position of a pixel if its to the top or to the bottom ', () => {
        const leftUpperCoord = { x: 320, y: 240 };
        const rightBottomCoord = { x: 640, y: 480 };
        const topPixelCoordinate = { x: 500, y: 400 };
        const bottomPixelCoordinate = { x: 350, y: 300 };
        expect(findQuadrantService['isOnTop'](topPixelCoordinate, leftUpperCoord.x, rightBottomCoord.x)).to.equal(true);
        expect(findQuadrantService['isOnTop'](bottomPixelCoordinate, leftUpperCoord.x, rightBottomCoord.x)).to.equal(false);
    });

});
