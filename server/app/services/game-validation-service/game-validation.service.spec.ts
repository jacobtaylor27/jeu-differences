import { Bmp } from '@app/classes/bmp/bmp';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { Coordinate } from '@common/coordinate';
import { expect } from 'chai';
import { createStubInstance, restore, SinonStubbedInstance, stub } from 'sinon';
import { GameValidation } from './game-validation.service';
<<<<<<< HEAD
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { Bmp } from '@app/classes/bmp/bmp';
=======
>>>>>>> 837f2b81ddbe1360bf209a0baf7725ded8699913

describe('GameValidation', () => {
    let gameValidation: GameValidation;
    let bmpSubtractor: SinonStubbedInstance<BmpSubtractorService>;
    let bmpDifferenceInterpreterSpyObj: SinonStubbedInstance<BmpDifferenceInterpreter>;
    // let differenceSpyObj: SinonSpiedInstance<BmpDifferenceInterpreter>;

    beforeEach(() => {
        bmpSubtractor = createStubInstance(BmpSubtractorService);
        bmpDifferenceInterpreterSpyObj = createStubInstance(BmpDifferenceInterpreter);
        gameValidation = new GameValidation(bmpSubtractor, bmpDifferenceInterpreterSpyObj);
    });

    it('should get the number of difference', async () => {
<<<<<<< HEAD
        const expectedDifferences = [[{} as BmpCoordinate]];
        const expectedReject = 'test failed error';
        const differenceBmpSpy = stub(gameValidation, 'differenceBmp').resolves();
=======
        const expectedDifferences = [[{} as Coordinate]];
>>>>>>> 837f2b81ddbe1360bf209a0baf7725ded8699913
        bmpDifferenceInterpreterSpyObj.getCoordinates.resolves(expectedDifferences);
        expect(await gameValidation.numberDifference({} as Bmp, {} as Bmp, 0)).to.equal(expectedDifferences.length);
        differenceBmpSpy.rejects(new Error(expectedReject));
        gameValidation.numberDifference({} as Bmp, {} as Bmp, 0).catch((reason: Error) => expect(reason.message).to.equal(expectedReject));
        bmpDifferenceInterpreterSpyObj.getCoordinates.rejects(new Error(expectedReject));
        gameValidation.numberDifference({} as Bmp, {} as Bmp, 0).catch((reason: Error) => expect(reason.message).to.equal(expectedReject));
    });

    it('should get difference from Bmp object', async () => {
        const expectedDifferences = {} as Bmp;
        const expectedReject = 'test failed error';
        bmpSubtractor.getDifferenceBMP.resolves(expectedDifferences);
        expect(await gameValidation.differenceBmp({} as Bmp, {} as Bmp, 0)).to.equal(expectedDifferences);
        bmpSubtractor.getDifferenceBMP.rejects(new Error(expectedReject));
        await gameValidation.differenceBmp({} as Bmp, {} as Bmp, 0).catch((reason: Error) => expect(reason.message).to.equal(expectedReject));
    });

    it('should return check if the number of differences is valid', async () => {
        const numberDifferenceSpy = stub(gameValidation, 'numberDifference').rejects();
        const expectedReject = 'test failed error';
        numberDifferenceSpy.rejects(new Error(expectedReject));
        gameValidation.isNbDifferenceValid({} as Bmp, {} as Bmp, 0).catch((reason: Error) => expect(reason.message).to.equal(expectedReject));

        numberDifferenceSpy.resolves(0);
        expect(await gameValidation.isNbDifferenceValid({} as Bmp, {} as Bmp, 0)).to.equal(false);

<<<<<<< HEAD
        numberDifferenceSpy.resolves(3);
        expect(await gameValidation.isNbDifferenceValid({} as Bmp, {} as Bmp, 0)).to.equal(true);
        const exceedDifference = 20;
        numberDifferenceSpy.resolves(exceedDifference);
=======
        bmpDifferenceInterpreterSpyObj.getCoordinates.resolves([[{} as Coordinate], [{} as Coordinate], [{} as Coordinate]]);
        expect(await gameValidation.isNbDifferenceValid({} as Bmp, {} as Bmp, 0)).to.equal(true);

        bmpDifferenceInterpreterSpyObj.getCoordinates.resolves([
            [{} as Coordinate],
            [{} as Coordinate],
            [{} as Coordinate],
            [{} as Coordinate],
            [{} as Coordinate],
            [{} as Coordinate],
            [{} as Coordinate],
            [{} as Coordinate],
            [{} as Coordinate],
            [{} as Coordinate],
        ]);
>>>>>>> 837f2b81ddbe1360bf209a0baf7725ded8699913
        expect(await gameValidation.isNbDifferenceValid({} as Bmp, {} as Bmp, 0)).to.equal(false);
    });

    afterEach(() => {
        restore();
    });
});
