import { Bmp } from '@app/classes/bmp/bmp';
import { DEFAULT_BMP_TEST_PATH } from '@app/constants/database';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { FileManagerService } from '@app/services/file-manager-service/file-manager.service';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import * as Sinon from 'sinon';
import { Container } from 'typedi';
chai.use(chaiAsPromised);

describe('Bmp service', async () => {
    let bmpService: BmpService;
    let bmpDecoderService: BmpDecoderService;
    let fileManagerService: FileManagerService;

    beforeEach(async () => {
        bmpService = Container.get(BmpService);
        bmpDecoderService = Container.get(BmpDecoderService);
        fileManagerService = Container.get(FileManagerService);
    });

    after(() => {
        Sinon.restore();
    });

    it('getBmpById(id) should return a bmp according to a specific id', async () => {
        const id = 'test_bmp_modified';
        const btmDecoded: Bmp = await bmpDecoderService.decodeBIntoBmp(DEFAULT_BMP_TEST_PATH + id + '.bmp');
        await expect(bmpService.getBmpById(id, DEFAULT_BMP_TEST_PATH)).to.eventually.deep.equal(btmDecoded);
    });

    it("getBmpById(id) should throw an error if the id doesn't exist", async () => {
        const invalidId = 'invalid-id-test-1000';
        await expect(bmpService.getBmpById(invalidId, DEFAULT_BMP_TEST_PATH))
            .to.eventually.be.rejectedWith('File not found')
            .and.be.an.instanceOf(Error);
    });

    it('getAllBmps()) should return all of the files in the Bmp format', async () => {
        const bmp1 = await bmpService.getBmpById('test_bmp_modified', DEFAULT_BMP_TEST_PATH);
        const bmp2 = await bmpService.getBmpById('bmp_test_2x2', DEFAULT_BMP_TEST_PATH);
        await expect(bmpService.getAllBmps(DEFAULT_BMP_TEST_PATH)).to.eventually.deep.equal([bmp2, bmp1]);
    });

    it('addBmp(bmpToConvert) should return add a .bmp files to the bmp-src and deleteBmpById should delete it', async () => {
        const fileName = 'test_bmp_modified.bmp';
        const buffer: Buffer = await fileManagerService.getFileContent(DEFAULT_BMP_TEST_PATH + fileName);

        await bmpService.addBFromArrayBuffer(await bmpDecoderService.convertBufferIntoArrayBuffer(buffer), DEFAULT_BMP_TEST_PATH);
        const fileNames = await fileManagerService.getFileNames(DEFAULT_BMP_TEST_PATH);
        expect(fileNames.length).to.equal(3);
        for (const name of fileNames) {
            if (name !== 'bmp_test_2x2' && name !== 'test_bmp_modified') {
                await bmpService.deleteBmpById(name, DEFAULT_BMP_TEST_PATH);
            }
        }
        expect((await fileManagerService.getFileNames(DEFAULT_BMP_TEST_PATH)).length).to.equal(2);
    });
});
