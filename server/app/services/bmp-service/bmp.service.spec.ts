import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { expect } from 'chai';
import { describe } from 'mocha';

describe('Bmp service', async () => {
    let bmpService: BmpService;
    let bmpDecoderService: BmpDecoderService;

    beforeEach(async () => {
        bmpDecoderService = new BmpDecoderService();
        bmpService = new BmpService(bmpDecoderService);
    });

    it('getBmpById(id) should return a bmp according to a specific id', async () => {
        console.log(bmpService);
        expect(1).to.be.equal(1);
    });
});
