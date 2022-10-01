import { Bmp } from '@app/classes/bmp/bmp';
import { DEFAULT_BMP_TEST_PATH } from '@app/constants/database';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import * as bmp from 'bmp-js';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { promises as fs } from 'fs';
import { describe } from 'mocha';
import { tmpdir } from 'os';
import * as Sinon from 'sinon';
import { Container } from 'typedi';
chai.use(chaiAsPromised);

describe('Bmp service', async () => {
    let bmpService: BmpService;
    let bmpDecoderService: BmpDecoderService;

    beforeEach(async () => {
        bmpService = Container.get(BmpService);
        bmpDecoderService = Container.get(BmpDecoderService);
        const bmpObj = await bmpDecoderService.decodeBIntoBmp(DEFAULT_BMP_TEST_PATH + 'test_bmp_original.bmp');
        const buffer = bmp.encode(await bmpObj.toImageData());
        fs.writeFile(tmpdir() + '1.bmp', buffer.data);
    });

    after(() => {
        fs.unlink(tmpdir() + '1.bmp');
        Sinon.restore();
    });

    it('getBmpById(id) should return a bmp according to a specific id', async () => {
        const id = '1';
        const btmDecoded: Bmp = await bmpDecoderService.decodeBIntoBmp(tmpdir() + id + '.bmp');
        await expect(bmpService.getBmpById(id, tmpdir())).to.eventually.deep.equal(btmDecoded);
    });
    /*
    it("getBmpById(id) should return undefined if the id doesn't exist", async () => {
        const invalidId = 'invalid-id-test-1000';
        await expect(bmpService.getBmpById(invalidId, tmpdir())).to.eventually.deep.equal(undefined);
    });

    it('getAllBmps()) should return all of the files in the Bmp format', async () => {
        const bmp1 = await bmpService.getBmpById('test_bmp_modified', tmpdir());
        const bmp2 = await bmpService.getBmpById('bmp_test_2x2', tmpdir());
        await expect(bmpService.getAllBmps(tmpdir())).to.eventually.deep.equal([bmp2, bmp1]);
    });

    it('addBmp(bmpToConvert) should return add a .bmp files to the bmp-src and deleteBmpById should delete it', async () => {
        const fileName = 'test_bmp_modified.bmp';
        const buffer: Buffer = await fileManagerService.getFileContent(tmpdir() + fileName);

        await bmpService.addBmp(await bmpDecoderService.convertBufferIntoArrayBuffer(buffer), tmpdir());
        const fileNames = await fileManagerService.getFileNames(tmpdir());
        expect(fileNames.length).to.equal(3);
        for (const name of fileNames) {
            if (name !== 'bmp_test_2x2' && name !== 'test_bmp_modified') {
                await bmpService.deleteBmpById(name, tmpdir());
            }
        }
        expect((await fileManagerService.getFileNames(tmpdir())).length).to.equal(2);
    });
    */
});
