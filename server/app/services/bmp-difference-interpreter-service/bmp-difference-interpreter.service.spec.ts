import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { Bmp } from '@app/classes/bmp/bmp';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { Container } from 'typedi';
chai.use(chaiAsPromised);

describe('Bmp difference interpreter service', async () => {
    let bmpDifferenceInterpreter: BmpDifferenceInterpreter;
    let bmpDecoderService: BmpDecoderService;

    beforeEach(async () => {
        bmpDifferenceInterpreter = Container.get(BmpDifferenceInterpreter);
        bmpDecoderService = Container.get(BmpDecoderService);
    });

    it('Should throw an exception if given a bmp with pixels other than black or white', () => {
        // prettier-ignore
        // eslint-disable-next-line
        const rawData = [0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 254, 255, 255];
        const width = 2;
        const height = 2;
        const bmpWithColors = new Bmp(width, height, rawData);
        expect(bmpDifferenceInterpreter.getCoordinates(bmpWithColors)).to.eventually.be.rejectedWith(Error);
    });
    it("A white image shouldn't have any difference", async () => {
        // prettier-ignore
        // eslint-disable-next-line
        const rawData = [0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255];
        const width = 2;
        const height = 2;
        const bmpWithColors = new Bmp(width, height, rawData);
        const nbOfDifference = 0;

        const coordinates: BmpCoordinate[][] = await bmpDifferenceInterpreter.getCoordinates(bmpWithColors);
        expect(coordinates.length).to.equal(nbOfDifference);
    });
    it('A black image should have one difference', async () => {
        // prettier-ignore
        // eslint-disable-next-line
        const rawData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const width = 2;
        const height = 2;
        const bmpWithColors = new Bmp(width, height, rawData);
        const nbOfDifference = 1;

        const coordinates: BmpCoordinate[][] = await bmpDifferenceInterpreter.getCoordinates(bmpWithColors);
        expect(coordinates.length).to.equal(nbOfDifference);
    });
    it('Black pixels side by side should be considered as one difference', async () => {
        // prettier-ignore
        // eslint-disable-next-line
        const rawData = [0, 255, 255, 255, 0, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0];
        const width = 2;
        const height = 2;
        const bmpWithColors = new Bmp(width, height, rawData);
        const nbOfDifference = 1;

        const coordinates: BmpCoordinate[][] = await bmpDifferenceInterpreter.getCoordinates(bmpWithColors);
        expect(coordinates.length).to.equal(nbOfDifference);
    });
    it('Black pixels in diagonal should be considered as one difference', async () => {
        // prettier-ignore
        // eslint-disable-next-line
        const rawData = [0, 255, 255, 255, 0, 0, 0, 0, 0, 255, 255, 255, 0, 0, 0, 0];
        const width = 2;
        const height = 2;
        const bmpWithColors = new Bmp(width, height, rawData);
        const nbOfDifference = 1;

        const coordinates: BmpCoordinate[][] = await bmpDifferenceInterpreter.getCoordinates(bmpWithColors);
        expect(coordinates.length).to.equal(nbOfDifference);
    });
    it('An array of difference should contain all of the differences', async () => {
        const filepath = './assets/test-bmp/two_difference_appart.bmp';
        const decodedBmp = await bmpDecoderService.decodeBIntoBmp(filepath);
        const interpretedBmp: BmpCoordinate[][] = await bmpDifferenceInterpreter.getCoordinates(decodedBmp);
        // prettier-ignore
        // eslint-disable-next-line
        const firstDifference: BmpCoordinate[] = [new BmpCoordinate(0, 0), new BmpCoordinate(0, 1), new BmpCoordinate(1, 0)];
        // eslint-disable-next-line
        const secondDifference: BmpCoordinate[] = [new BmpCoordinate(0, 5), new BmpCoordinate(1, 4), new BmpCoordinate(1, 5)];
        const expectedCoordinates: BmpCoordinate[][] = [firstDifference, secondDifference];
        expect(interpretedBmp).to.eql(expectedCoordinates);
        interpretedBmp[0].forEach((coordinate, index) => {
            expect(coordinate.getRow()).to.equal(firstDifference[index].getRow());
            expect(coordinate.getColumn()).to.equal(firstDifference[index].getColumn());
        });
        interpretedBmp[1].forEach((coordinate, index) => {
            expect(coordinate.getRow()).to.equal(secondDifference[index].getRow());
            expect(coordinate.getColumn()).to.equal(secondDifference[index].getColumn());
        });
    });
    it('The algorithm should also work on a bmp with a large width and height', async () => {
        const filepath = './assets/test-bmp/ten_difference.bmp';
        const bmpDecoded = await bmpDecoderService.decodeBIntoBmp(filepath);
        const nbOfDifference = 10;
        const differences: BmpCoordinate[][] = await bmpDifferenceInterpreter.getCoordinates(bmpDecoded);
        expect(differences.length).to.equal(nbOfDifference);
    });
});
