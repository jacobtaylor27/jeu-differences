import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { Coordinate } from '@common/coordinate';
import { expect } from 'chai';
import { describe } from 'mocha';

describe('BmpCoordinate', () => {
    it('BmpCoordinate constructor should create a coordinate with positive values', () => {
        const row = 0;
        const column = 1;
        const coordinate = new BmpCoordinate(row, column);
        expect(coordinate).to.be.instanceOf(BmpCoordinate);
        expect(coordinate.getRow()).to.be.equal(row);
        expect(coordinate.getColumn()).to.be.equal(column);
    });

    it('BmpCoordinate constructor should not allow negative coordinates', () => {
        expect(() => {
            // eslint-disable-next-line
            new BmpCoordinate(-1, 1);
        }).to.throw(Error);
    });

    it('BmpCoordinate constructor should not allow negative coordinates', () => {
        expect(() => {
            // eslint-disable-next-line
            new BmpCoordinate(1, -1);
        }).to.throw(Error);
    });

    it('toCoordinate() should convert BmpCoordinates to Coordinate', () => {
        const coordinate = new BmpCoordinate(1, 1);
        const expectedCoordinate: Coordinate = {
            x: coordinate.getRow(),
            y: coordinate.getColumn(),
        };
        expect(expectedCoordinate.x).to.equal(coordinate.toCoordinate().x);
        expect(expectedCoordinate.y).to.equal(coordinate.toCoordinate().y);
    });
});
