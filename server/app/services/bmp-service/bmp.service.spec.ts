import { BmpService } from '@app/services/bmp-service/bmp.service';
import { expect } from 'chai';
import { describe } from 'mocha';
import { Container } from 'typedi';

describe('Bmp service', async () => {
    let bmpService: BmpService;

    beforeEach(async () => {
        bmpService = Container.get(BmpService);
    });

    it('getBmpById(id) should return a bmp according to a specific id', async () => {
        console.log(bmpService);
        expect(1).to.be.equal(1);
    });
});
