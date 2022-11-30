/* eslint-disable @typescript-eslint/no-magic-numbers */
import { DifferenceService } from '@app/services/difference-service/difference.service';
import { restore } from 'sinon';

describe('DifferenceService', () => {
    let difference: DifferenceService;
    beforeEach(() => {
        difference = new DifferenceService();
    });

    afterEach(() => {
        restore();
    });
});
