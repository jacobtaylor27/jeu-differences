import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { Coordinate } from '@common/coordinate';
import { expect } from 'chai';
import { Container } from 'typedi';
import { MidpointAlgorithm } from './mid-point-algorithm';

/* eslint-disable @typescript-eslint/no-magic-numbers */
describe('Midpoint Algorithn', async () => {
    let midpointAlgorithm: MidpointAlgorithm;

    beforeEach(async () => {
        midpointAlgorithm = Container.get(MidpointAlgorithm);
    });

    it('Should return return center when radius is 0', () => {
        const center: BmpCoordinate = new BmpCoordinate(2, 3);
        const radius = 0;
        const coordinates: BmpCoordinate[] = midpointAlgorithm['findContourEnlargement'](center, radius);

        expect(coordinates.length).to.equal(1);
        expect(coordinates[0].getX()).to.equal(2);
        expect(coordinates[0].getY()).to.equal(3);
    });

    it('Should return correct value is in Quadrant', () => {
        const distanceCorrect: Coordinate = { x: 3, y: 1 };
        const distanceCIncorrect: Coordinate = { x: 1, y: 3 };
        const distanceCIncorrect2: Coordinate = { x: 1, y: 1 };
        expect(midpointAlgorithm['isInQuadrant'](distanceCorrect)).to.be.true;
        expect(midpointAlgorithm['isInQuadrant'](distanceCIncorrect)).to.be.false;
        expect(midpointAlgorithm['isInQuadrant'](distanceCIncorrect2)).to.be.false;
    });

    it('Should return correct value is outside Quadrant', () => {
        const distanceCorrect: Coordinate = { x: 1, y: 3 };
        const distanceCIncorrect: Coordinate = { x: 3, y: 1 };
        const distanceCIncorrect2: Coordinate = { x: 1, y: 1 };
        expect(midpointAlgorithm['isOutsideQuadrant'](distanceCorrect)).to.be.true;
        expect(midpointAlgorithm['isOutsideQuadrant'](distanceCIncorrect)).to.be.false;
        expect(midpointAlgorithm['isOutsideQuadrant'](distanceCIncorrect2)).to.be.false;
    });

    it('Should invert the distance coordinates', () => {
        const distance: Coordinate = { x: 1, y: 3 };
        const distanceInverted = midpointAlgorithm['invertDistance'](distance);
        const expectedDistance: Coordinate = { x: 3, y: 1 };

        expect(distanceInverted.x).to.equal(expectedDistance.x);
        expect(distanceInverted.y).to.equal(expectedDistance.y);
    });

    it('Should return correct value if perimeter is negative', () => {
        const perimeterCorrect: number = -1;
        const perimeterCorrect2: number = 0;
        const perimeterIncorrect: number = 1;
        expect(midpointAlgorithm['perimeterIsNegative'](perimeterCorrect)).to.be.true;
        expect(midpointAlgorithm['perimeterIsNegative'](perimeterCorrect2)).to.be.true;
        expect(midpointAlgorithm['perimeterIsNegative'](perimeterIncorrect)).to.be.false;
    });

    it('Should return true if is not equidistant', () => {
        const distanceEquidistant: Coordinate = { x: 1, y: 1 };
        const distanceNotEquidistant: Coordinate = { x: 1, y: 3 };
        expect(midpointAlgorithm['isNotEquidistant'](distanceNotEquidistant)).to.be.true;
        expect(midpointAlgorithm['isNotEquidistant'](distanceEquidistant)).to.be.false;
    });

    it('should increment the perimeter correctly ', () => {
        const distance: Coordinate = { x: 1, y: 3 };
        const perimeterPositive = 1;
        const expectedPerimeterPositive = 8;
        const perimeterNegative = -1;
        const expectedPerimeterNegative = 6;

        expect(midpointAlgorithm['incrementPerimeter'](perimeterPositive, distance)).to.equal(expectedPerimeterPositive);
        expect(midpointAlgorithm['incrementPerimeter'](perimeterNegative, distance)).to.equal(expectedPerimeterNegative);
    });

    it('should add all four initial coordinates ', () => {
        const center: BmpCoordinate = new BmpCoordinate(2, 2);
        const distance: Coordinate = { x: 1, y: 3 };
        let coordinates: BmpCoordinate[] = [];
        midpointAlgorithm['addInitial4Coords'](center, distance, coordinates);

        expect(coordinates.length).to.equal(4);
        expect(coordinates[0].getX()).to.equal(3);
        expect(coordinates[0].getY()).to.equal(2);
        expect(coordinates[1].getX()).to.equal(1);
        expect(coordinates[1].getY()).to.equal(2);
        expect(coordinates[2].getX()).to.equal(2);
        expect(coordinates[2].getY()).to.equal(3);
        expect(coordinates[3].getX()).to.equal(2);
        expect(coordinates[3].getY()).to.equal(1);
    });

    it('should not add coord if coord is negative', () => {
        const center: BmpCoordinate = new BmpCoordinate(0, 0);
        const distance: Coordinate = { x: 1, y: 3 };
        let coordinates: BmpCoordinate[] = [];
        midpointAlgorithm['addInitial4Coords'](center, distance, coordinates);

        expect(coordinates.length).to.equal(2);
    });

    it('should not add coord if coord is outside bound', () => {
        const center: BmpCoordinate = new BmpCoordinate(640, 480);
        const distance: Coordinate = { x: 1, y: 3 };
        let coordinates: BmpCoordinate[] = [];
        midpointAlgorithm['addInitial4Coords'](center, distance, coordinates);

        expect(coordinates.length).to.equal(2);
    });
});
