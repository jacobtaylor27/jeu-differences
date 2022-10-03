import { Bmp } from '@app/classes/bmp/bmp';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { promises as fs } from 'fs';
import { describe } from 'mocha';
import { TEST_2X2_BMP, TEST_2X3_BMP, TEST_3X2_BMP } from './bmp-decoder-service.spec.contants';

chai.use(chaiAsPromised);

describe.only('Bmp decoder service', () => {
    let bmpDecoderService: BmpDecoderService;

    beforeEach(async () => {
        bmpDecoderService = new BmpDecoderService();
    });

    it('decodeBIntoBmp(...) Should create an object Bmp based on bmp file of size 2x2', async () => {
        const filepath = './assets/test-bmp/bmp_test_2x2.bmp';
        const bmpProduced = await bmpDecoderService.decodeBIntoBmp(filepath);
        expect(bmpProduced.getWidth()).to.equals(TEST_2X2_BMP.file[0].length);
        expect(bmpProduced.getHeight()).to.equals(TEST_2X2_BMP.file.length);
        expect(bmpProduced.getPixels()).to.eql(TEST_2X2_BMP.file);
    });

    it('decodeBIntoBmp(...) Should create an object Bmp based on bmp file of size 3x2', async () => {
        const filepath = './assets/test-bmp/bmp_test_3x2.bmp';
        const bmpProduced = await bmpDecoderService.decodeBIntoBmp(filepath);
        expect(bmpProduced.getWidth()).to.equals(TEST_3X2_BMP.file[0].length);
        expect(bmpProduced.getHeight()).to.equals(TEST_3X2_BMP.file.length);
        expect(bmpProduced.getPixels()).to.eql(TEST_3X2_BMP.file);
    });

    it('decodeBIntoBmp(...) Should create an object Bmp based on bmp file of size 2x3', async () => {
        const filepath = './assets/test-bmp/bmp_test_2x3.bmp';
        const bmpProduced = await bmpDecoderService.decodeBIntoBmp(filepath);
        expect(bmpProduced.getWidth()).to.equals(TEST_2X3_BMP.file[0].length);
        expect(bmpProduced.getHeight()).to.equals(TEST_2X3_BMP.file.length);
        expect(bmpProduced.getPixels()).to.eql(TEST_2X3_BMP.file);
    });

    it('decodeBIntoBmp(...) Should throw an error if the path is incorrect', async () => {
        const invalidPath = '.bmp';
        await expect(bmpDecoderService.decodeBIntoBmp(invalidPath)).to.eventually.be.rejectedWith(Error).and.have.property('code', 'ENOENT');
    });

    it('decodeBIntoBmp(...) Should throw an error if the path is incorrect', async () => {
        const invalidPath = '.bmp';
        await expect(bmpDecoderService.decodeBIntoBmp(invalidPath)).to.eventually.be.rejectedWith(Error).and.have.property('code', 'ENOENT');
    });

    it('decodeBIntoBmp(...) Should throw an error if the file is not a bitmap', async () => {
        const filepath = './assets/test-bmp/jpg_test.jpg';
        await expect(bmpDecoderService.decodeBIntoBmp(filepath))
            .to.eventually.be.rejectedWith('The file should end with .bmp')
            .and.be.an.instanceOf(Error);
    });

    it("decodeBIntoBmp(...) Should throw an error if the file is a bitmap but doesn't exists", async () => {
        const filepath = './assets/test-bmp/doesntexistfile.bmp';
        await expect(bmpDecoderService.decodeBIntoBmp(filepath)).to.eventually.be.rejectedWith(Error).and.have.property('code', 'ENOENT');
    });

    it('decodeBIntoBmp(...) Should throw an error if the file is corrupted', async () => {
        const filepath = './assets/test-bmp/corrupted.bmp';
        await expect(bmpDecoderService.decodeBIntoBmp(filepath))
            .to.eventually.be.rejectedWith('Le décodage du bmp a échoué')
            .and.be.an.instanceOf(Error);
    });

    it('decodeArrayBufferToBmp(...) Should convert an array buffer into a bmp object', async () => {
        const filepath = './assets/test-bmp/test_bmp_modified.bmp';
        const bmpBuffer: Buffer = await fs.readFile(filepath);
        const arrayBufferToTest: ArrayBuffer = await bmpDecoderService.convertBufferIntoArrayBuffer(bmpBuffer);
        const resultBmp: Bmp = await bmpDecoderService.decodeArrayBufferToBmp(arrayBufferToTest);
        const expectedBmp = await bmpDecoderService.decodeBIntoBmp(filepath);
        expect(resultBmp).to.deep.equal(expectedBmp);
    });

    it("decodeArrayBufferToBmp(...) Should throw an exception if the arraybuffer doesn't have a bmp header", async () => {
        const arrayBuf: ArrayBuffer = new ArrayBuffer(0);
        await expect(bmpDecoderService.decodeArrayBufferToBmp(arrayBuf))
            .to.eventually.be.rejectedWith('Le décodage du bmp a échoué')
            .and.be.an.instanceOf(Error);
    });

    it('decodeArrayBufferToBmp(...) Should throw an exception if the arraybuffer has a corrupted file', async () => {
        const filepath = './assets/test-bmp/corrupted.bmp';
        const bmpBuffer: Buffer = await fs.readFile(filepath);
        const bmpFile: ArrayBuffer = await bmpDecoderService.convertBufferIntoArrayBuffer(bmpBuffer);
        await expect(bmpDecoderService.decodeArrayBufferToBmp(bmpFile))
            .to.eventually.be.rejectedWith('Le décodage du bmp a échoué')
            .and.be.an.instanceOf(Error);
    });
});
