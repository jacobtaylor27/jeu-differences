import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { Bmp } from '@app/classes/bmp/bmp';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { Coordinate } from '@common/coordinate';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { Container } from 'typedi';
chai.use(chaiAsPromised);

describe('Bmp difference interpreter service', async () => {
    let bmpDifferenceInterpreter: BmpDifferenceInterpreter;
    let bmpDecoderService: BmpDecoderService;
    let bmpSubtractorService: BmpSubtractorService;

    beforeEach(async () => {
        bmpDifferenceInterpreter = Container.get(BmpDifferenceInterpreter);
        bmpDecoderService = Container.get(BmpDecoderService);
        bmpSubtractorService = Container.get(BmpSubtractorService);
    });

    it("A white image shouldn't have any difference", async () => {
        // eslint-disable-next-line -- no magic number
        const rawData = [0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255];
        const width = 2;
        const height = 2;
        const bmpWithColors = new Bmp({ width, height }, rawData);
        const nbOfDifference = 0;

        const coordinates: Coordinate[][] = await bmpDifferenceInterpreter.getCoordinates(bmpWithColors);
        expect(coordinates.length).to.equal(nbOfDifference);
    });

    it('A black image should have one difference', async () => {
        const nbOfDifference = 1;
        const blackImageFilepath = './assets/test-bmp/test-performance/blackImage.bmp';
        const bmpDecoded = await bmpDecoderService.decodeBIntoBmp(blackImageFilepath);
        const differences: Coordinate[][] = await bmpDifferenceInterpreter.getCoordinates(bmpDecoded);
        expect(differences.length).to.equal(nbOfDifference);
    });

    it('A big black region on an image should be considered as one difference ', async () => {
        const nbOfDifference = 1;
        const blackImageFilepath = './assets/test-bmp/test-performance/majorityBlackImage.bmp';
        const bmpDecoded = await bmpDecoderService.decodeBIntoBmp(blackImageFilepath);
        const differences: Coordinate[][] = await bmpDifferenceInterpreter.getCoordinates(bmpDecoded);
        expect(differences.length).to.equal(nbOfDifference);
    });

    it('An array of difference should contain all of the differences', async () => {
        const filepath = './assets/test-bmp/two_difference_appart.bmp';
        const decodedBmp = await bmpDecoderService.decodeBIntoBmp(filepath);
        const interpretedBmp: Coordinate[][] = await bmpDifferenceInterpreter.getCoordinates(decodedBmp);
        // eslint-disable-next-line -- no magic number
        const firstDifference: BmpCoordinate[] = [new BmpCoordinate(0, 0), new BmpCoordinate(1, 0), new BmpCoordinate(0, 1)];
        // eslint-disable-next-line -- no magic number
        const secondDifference: BmpCoordinate[] = [new BmpCoordinate(5, 0), new BmpCoordinate(4, 1), new BmpCoordinate(5, 1)];
        const expectedCoordinates: BmpCoordinate[][] = [firstDifference, secondDifference];
        expect(interpretedBmp).to.eql(expectedCoordinates);
        interpretedBmp[0].forEach((coordinate, index) => {
            expect(coordinate.x).to.deep.equal(firstDifference[index].getX());
            expect(coordinate.y).to.deep.equal(firstDifference[index].getY());
        });
        interpretedBmp[1].forEach((coordinate, index) => {
            expect(coordinate.x).to.deep.equal(secondDifference[index].getX());
            expect(coordinate.y).to.deep.equal(secondDifference[index].getY());
        });
    });

    it('The algorithm should also work on a bmp with a large width and height', async () => {
        const filepath = './assets/test-bmp/ten_difference.bmp';
        const bmpDecoded = await bmpDecoderService.decodeBIntoBmp(filepath);
        const nbOfDifference = 10;
        const differences: Coordinate[][] = await bmpDifferenceInterpreter.getCoordinates(bmpDecoded);
        expect(differences.length).to.equal(nbOfDifference);
    });

    it('The coordinates returned should be in a specific order', async () => {
        const filepath = './assets/test-bmp/coordinates_verifier.bmp';
        const bmpDecoded = await bmpDecoderService.decodeBIntoBmp(filepath);
        const coordinatedExpedted: BmpCoordinate[][] = [[new BmpCoordinate(0, 0), new BmpCoordinate(1, 0)]];
        const differences: Coordinate[][] = await bmpDifferenceInterpreter.getCoordinates(bmpDecoded);
        expect(differences).to.deep.equal(coordinatedExpedted);
    });

    it.only('getting the number of differences', async () => {
        const radius = 15;
        const filepath = './assets/src-bmp/projet2-equipe-106-a935c378-eaaa-4602-9a08-dc841986d3d5.bmp';
        const whiteBmp = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test-performance/white_bmp.bmp');
        const bmpDecoded = await bmpDecoderService.decodeBIntoBmp(filepath);
        const bmpResulting = await bmpSubtractorService.getDifferenceBMP(bmpDecoded, whiteBmp, radius);
        const differences: Coordinate[][] = await bmpDifferenceInterpreter.getCoordinates(bmpResulting);
        console.log(differences.length);
    });
});
