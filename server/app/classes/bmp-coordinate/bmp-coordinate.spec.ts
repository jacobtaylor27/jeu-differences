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
        expect(coordinate.getX()).to.be.equal(row);
        expect(coordinate.getY()).to.be.equal(column);
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
        const coordinate = new BmpCoordinate(1, 2);
        const expectedCoordinate: Coordinate = {
            x: coordinate.getX(),
            y: coordinate.getY(),
        };
        expect(expectedCoordinate.x).to.equal(coordinate.toCoordinate().x);
        expect(expectedCoordinate.y).to.equal(coordinate.toCoordinate().y);
    });
});
