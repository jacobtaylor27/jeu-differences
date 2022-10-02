import { Bmp } from '@app/classes/bmp/bmp';
import { BMP_EXTENSION, DEFAULT_BMP_TEST_PATH, ID_PREFIX } from '@app/constants/database';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import * as bmp from 'bmp-js';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { promises as fs } from 'fs';
import { describe } from 'mocha';
import { tmpdir } from 'os';
import * as path from 'path';
import { Container } from 'typedi';

chai.use(chaiAsPromised);

describe('Bmp service', async () => {
    let bmpService: BmpService;
    let bmpDecoderService: BmpDecoderService;

    beforeEach(async () => {
        bmpService = Container.get(BmpService);
        bmpDecoderService = Container.get(BmpDecoderService);
        const bmpObj = await bmpDecoderService.decodeBIntoBmp(DEFAULT_BMP_TEST_PATH + '/test_bmp_original.bmp');
        const buffer = bmp.encode(await bmpObj.toImageData());
        await fs.writeFile(path.join(tmpdir(), ID_PREFIX + '1' + BMP_EXTENSION), buffer.data);
        await fs.writeFile(path.join(tmpdir(), ID_PREFIX + '2' + BMP_EXTENSION), buffer.data);
    });

    after(async () => {
        await fs.unlink(path.join(tmpdir(), ID_PREFIX + '1' + BMP_EXTENSION));
        await fs.unlink(path.join(tmpdir(), ID_PREFIX + '2' + BMP_EXTENSION));
    });

    it('getBmpById(id) should return a bmp according to a specific id', async () => {
        const id = '1';
        const btmDecoded: Bmp = await bmpDecoderService.decodeBIntoBmp(path.join(tmpdir(), ID_PREFIX + id + BMP_EXTENSION));
        await expect(bmpService.getBmpById(id, tmpdir())).to.eventually.deep.equal(btmDecoded);
    });

    it("getBmpById(id) should return throw an exception if the id doesn't exist", async () => {
        const invalidId = 'invalid-id-test-1000';
        await expect(bmpService.getBmpById(invalidId, tmpdir()))
            .to.eventually.be.rejectedWith("Couldn't get the bmp by id")
            .and.be.an.instanceof(Error);
    });

    it('getAllBmps()) should return all of the files in the Bmp format', async () => {
        expect((await bmpService.getAllBmps(tmpdir())).length).to.equal(2);
    });

    it('deleteBmpById(bmpId) should delete a file in a folder', async () => {
        await bmpService.deleteBmpById('1', tmpdir());
        expect((await bmpService.getAllBmps(tmpdir())).length).to.equal(1);
        const bmpObj = await bmpDecoderService.decodeBIntoBmp(DEFAULT_BMP_TEST_PATH + '/test_bmp_original.bmp');
        const buffer = bmp.encode(await bmpObj.toImageData());
        await fs.writeFile(path.join(tmpdir(), ID_PREFIX + '1' + BMP_EXTENSION), buffer.data);
    });

    it('addBmp(bmp) should create a file and store it with a unique id', async () => {});
});
