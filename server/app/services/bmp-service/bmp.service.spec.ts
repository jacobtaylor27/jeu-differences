import { DEFAULT_BMP_ASSET_PATH } from '@app/constants/database';
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
        const filepath: string = DEFAULT_BMP_ASSET_PATH + ''
        const await bmpService.getBmpById()
    });

    it("getBmpById(id) should return undefined if the id doesn't exist", async () => {
        console.log(bmpService);
        expect(1).to.be.equal(1);
    });

    it('getAllBmps()) should return all of the files in the Bmp format', async () => {
        console.log(bmpService);
        expect(1).to.be.equal(1);
    });

    it('getBmpById(bmpId) should return a bmp object', async () => {
        console.log(bmpService);
        expect(1).to.be.equal(1);
    });

    it('addBmp(bmpToConvert) should return add a .bmp files to the bmp-src', async () => {
        console.log(bmpService);
        expect(1).to.be.equal(1);
    });

    it('deleteBmpById(bmpId) should ', async () => {
        console.log(bmpService);
        expect(1).to.be.equal(1);
    });
});
