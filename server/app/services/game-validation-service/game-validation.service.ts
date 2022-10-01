import { Service } from 'typedi';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { Bmp } from '@app/classes/bmp/bmp';
import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { Difference } from '@app/constants/game';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';

@Service()
export class GameValidation {
    constructor(
        private bmpSubtractor: BmpSubtractorService,
        private bmpDifferenceInterpreter: BmpDifferenceInterpreter,
        private bmpDecoder: BmpDecoderService,
    ) {}

    async numberDifference(bmpDifferentiated: Bmp) {
        return this.bmpDifferenceInterpreter
            .getCoordinates(bmpDifferentiated)
            .then((coordinates: BmpCoordinate[][]) => coordinates.length)
            .catch(() => null);
    }

    async differenceBmp(original: Bmp, modify: Bmp, radius: number) {
        if (!original || !modify) {
            return null;
        }
        return this.bmpSubtractor
            .getDifferenceBMP(original, modify, radius)
            .then((differenceBMP: Bmp) => differenceBMP)
            .catch(() => null);
    }

    async isNbDifferenceValid(original: Bmp, modify: Bmp, radius: number) {
        return this.differenceBmp(original, modify, radius)
            .then(async (bmpDifferentiated: Bmp) =>
                this.bmpDifferenceInterpreter
                    .getCoordinates(bmpDifferentiated)
                    .then((coordinates: BmpCoordinate[][]) => coordinates.length >= Difference.MIN || coordinates.length <= Difference.MAX)
                    .catch(() => null),
            )
            .catch(() => null);
    }

    async isGameValid(original: ArrayBuffer, modify: ArrayBuffer, radius: number) {
        let modifyBmp: Bmp;
        let originalBmp: Bmp;
        try {
            modifyBmp = await this.bmpDecoder.decodeArrayBufferToBmp(modify);
            originalBmp = await this.bmpDecoder.decodeArrayBufferToBmp(original);
        } catch (e) {
            return Promise.reject();
        }
        return await this.isNbDifferenceValid(originalBmp, modifyBmp, radius);
    }
}
