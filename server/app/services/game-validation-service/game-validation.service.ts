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

}
