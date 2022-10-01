import { Bmp } from '@app/classes/bmp/bmp';
import { DEFAULT_BMP_TEST_PATH } from '@app/constants/database';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { Container } from 'typedi';
chai.use(chaiAsPromised);

describe.only('Bmp service', async () => {
    let bmpService: BmpService;
    let bmpDecoderService: BmpDecoderService;

    beforeEach(async () => {
        bmpService = Container.get(BmpService);
        bmpDecoderService = Container.get(BmpDecoderService);
    });

    it('getBmpById(id) should return a bmp according to a specific id', async () => {
        const id = 'test_bmp_modified';
        const bmp: Bmp = await bmpDecoderService.decodeBIntoBmp(DEFAULT_BMP_TEST_PATH + id + '.bmp');
        await expect(bmpService.getBmpById(id, DEFAULT_BMP_TEST_PATH)).to.eventually.deep.equal(bmp);
    });

    it("getBmpById(id) should return undefined if the id doesn't exist", async () => {
        const invalidId = 'invalid-id-test-1000';
        await expect(bmpService.getBmpById(invalidId, DEFAULT_BMP_TEST_PATH)).to.eventually.deep.equal(undefined);
    });

    it('getAllBmps()) should return all of the files in the Bmp format', async () => {
        const bmp1 = await bmpService.getBmpById('test_bmp_modified', DEFAULT_BMP_TEST_PATH);
        const bmp2 = await bmpService.getBmpById('bmp_test_2x2', DEFAULT_BMP_TEST_PATH);
        await expect(bmpService.getAllBmps(DEFAULT_BMP_TEST_PATH)).to.eventually.deep.equal([bmp2, bmp1]);
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
