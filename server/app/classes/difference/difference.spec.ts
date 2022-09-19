import { Difference } from '@app/classes/difference/difference';
import { Coordinate } from '@app/interface/coordinate';
import { expect } from 'chai';
import { describe } from 'mocha';

describe('Difference', () => {
    it('A difference should be created', () => {
        const coordinate: Coordinate = {
            row: 0,
            column: 0,
        };
        const difference = new Difference(coordinate);
        expect(difference.getCoordinate()).to.deep.equal(coordinate);
    });

    it("getCoordinates shouldn't allow negative coordinates", () => {
        try {
            const invalidCoordinates: Coordinate = { row: -1, column: 1 };
            const differenceObtained = new Difference(invalidCoordinates);
            expect(differenceObtained).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
        try {
            const invalidCoordinates: Coordinate = { row: 1, column: -1 };
            const differenceObtained = new Difference(invalidCoordinates);
            expect(differenceObtained).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });
});
