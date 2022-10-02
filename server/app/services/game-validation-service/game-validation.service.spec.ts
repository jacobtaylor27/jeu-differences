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

    afterEach(() => {
        restore();
    });
});
