import { restore, createStubInstance, SinonStubbedInstance, stub } from 'sinon';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { expect } from 'chai';
import { GameValidation } from './game-validation.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { Bmp } from '@app/classes/bmp/bmp';

describe('GameValidation', () => {
    let gameValidation: GameValidation;
    let bmpSubtractor: SinonStubbedInstance<BmpSubtractorService>;
    let bmpDifferenceInterpreterSpyObj: SinonStubbedInstance<BmpDifferenceInterpreter>;
    let bmpDecoder: SinonStubbedInstance<BmpDecoderService>;
    // let differenceSpyObj: SinonSpiedInstance<BmpDifferenceInterpreter>;

    beforeEach(() => {
        bmpSubtractor = createStubInstance(BmpSubtractorService);
        bmpDifferenceInterpreterSpyObj = createStubInstance(BmpDifferenceInterpreter);
        bmpDecoder = createStubInstance(BmpDecoderService);
        gameValidation = new GameValidation(bmpSubtractor, bmpDifferenceInterpreterSpyObj, bmpDecoder);
    });

    it('should get the number of difference', async () => {
        const expectedDifferences = [[{} as BmpCoordinate]];
        bmpDifferenceInterpreterSpyObj.getCoordinates.resolves(expectedDifferences);
        expect(await gameValidation.numberDifference({} as Bmp)).to.equal(expectedDifferences.length);
        bmpDifferenceInterpreterSpyObj.getCoordinates.rejects();
        expect(await gameValidation.numberDifference({} as Bmp)).to.equal(null);
    });

    it('should get difference from Bmp object', async () => {
        const expectedDifferences = {} as Bmp;
        bmpSubtractor.getDifferenceBMP.resolves(expectedDifferences);
        expect(await gameValidation.differenceBmp({} as Bmp, {} as Bmp, 0)).to.equal(expectedDifferences);
        bmpSubtractor.getDifferenceBMP.rejects();
        expect(await gameValidation.differenceBmp({} as Bmp, {} as Bmp, 0)).to.equal(null);
    });

    it('should return check if the number of differences is valid', async () => {
        const differenceBmpSpy = stub(gameValidation, 'differenceBmp').rejects();
        expect(await gameValidation.isNbDifferenceValid({} as Bmp, {} as Bmp, 0)).to.equal(null);
        differenceBmpSpy.resolves();

        bmpDifferenceInterpreterSpyObj.getCoordinates.rejects();
        expect(await gameValidation.isNbDifferenceValid({} as Bmp, {} as Bmp, 0)).to.equal(null);

        bmpDifferenceInterpreterSpyObj.getCoordinates.resolves([]);
        expect(await gameValidation.isNbDifferenceValid({} as Bmp, {} as Bmp, 0)).to.equal(false);

        bmpDifferenceInterpreterSpyObj.getCoordinates.resolves([[{} as BmpCoordinate], [{} as BmpCoordinate], [{} as BmpCoordinate]]);
        expect(await gameValidation.isNbDifferenceValid({} as Bmp, {} as Bmp, 0)).to.equal(true);

        bmpDifferenceInterpreterSpyObj.getCoordinates.resolves([
            [{} as BmpCoordinate],
            [{} as BmpCoordinate],
            [{} as BmpCoordinate],
            [{} as BmpCoordinate],
            [{} as BmpCoordinate],
            [{} as BmpCoordinate],
            [{} as BmpCoordinate],
            [{} as BmpCoordinate],
            [{} as BmpCoordinate],
            [{} as BmpCoordinate],
        ]);
        expect(await gameValidation.isNbDifferenceValid({} as Bmp, {} as Bmp, 0)).to.equal(false);
    });

    it('should return if the game is valid', async () => {
        const expectedReject = 'bmp decode failed';
        bmpDecoder.decodeArrayBufferToBmp.rejects(expectedReject);
        gameValidation.isGameValid({} as ArrayBuffer, {} as ArrayBuffer, 0).catch((reason) => expect(reason).to.equal(expectedReject));
        bmpDecoder.decodeArrayBufferToBmp.resolves();
        const isNbDifferenceValid = stub(gameValidation, 'isNbDifferenceValid').rejects(expectedReject);
        gameValidation.isGameValid({} as ArrayBuffer, {} as ArrayBuffer, 0).catch((reason) => expect(reason).to.equal(expectedReject));
        const expectedDifferenceValid = true;
        isNbDifferenceValid.resolves(expectedDifferenceValid);
        expect(await gameValidation.isGameValid({} as ArrayBuffer, {} as ArrayBuffer, 0)).to.equal(expectedDifferenceValid);
    });

    afterEach(() => {
        restore();
    });
});
