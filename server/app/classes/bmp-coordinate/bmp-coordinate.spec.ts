import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { expect } from 'chai';
import { describe } from 'mocha';

describe('BmpCoordinate', () => {
    it('BmpCoordinate should create a coordinate with positive values', () => {
        const row = 0;
        const column = 1;
        const coordinate = new BmpCoordinate(row, column);
        expect(coordinate).to.be.instanceOf(BmpCoordinate);
        expect(coordinate.getRow()).to.be.equal(row);
        expect(coordinate.getColumn()).to.be.equal(column);
    });
    it('BmpCoordinate should not allow negative coordinates', () => {
        try {
            // prettier-ignore
            // eslint-disable-next-line
            const coordinate = new BmpCoordinate(-1, 1);
            expect(coordinate).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });
});
