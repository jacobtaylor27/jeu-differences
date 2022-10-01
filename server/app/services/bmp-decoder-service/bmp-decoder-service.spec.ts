import { Bmp } from '@app/classes/bmp/bmp';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { FileManagerService } from '@app/services/file-manager-service/file-manager.service';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
chai.use(chaiAsPromised);

describe('Bmp decoder service', () => {
    let bmpDecoderService: BmpDecoderService;
    let fileManagerService: FileManagerService;

    beforeEach(async () => {
        fileManagerService = new FileManagerService();
        bmpDecoderService = new BmpDecoderService(fileManagerService);
    });

    it('decodeBIntoBmp(...) Should create an object Bmp based on bmp file of size 2x2', async () => {
        const pixelsExpected = [
            [
                { a: 0, r: 0, g: 0, b: 255 },
                { a: 0, r: 255, g: 0, b: 0 },
            ],
            [
                { a: 0, r: 0, g: 255, b: 0 },
                { a: 0, r: 255, g: 255, b: 255 },
            ],
        ];

        const filepath = './assets/test-bmp/bmp_test_2x2.bmp';
        const bmpProduced = await bmpDecoderService.decodeBIntoBmp(filepath);

        expect(bmpProduced.getWidth()).to.equals(pixelsExpected[0].length);
        expect(bmpProduced.getHeight()).to.equals(pixelsExpected.length);
        expect(bmpProduced.getPixels()).to.eql(pixelsExpected);
    });

    it('decodeBIntoBmp(...) Should create an object Bmp based on bmp file of size 3x2', async () => {
        const pixelsExpected = [
            [
                { a: 0, r: 0, g: 0, b: 255 },
                { a: 0, r: 255, g: 0, b: 0 },
                { a: 0, r: 128, g: 0, b: 128 },
            ],
            [
                { a: 0, r: 192, g: 192, b: 192 },
                { a: 0, r: 255, g: 255, b: 0 },
                { a: 0, r: 0, g: 255, b: 255 },
            ],
        ];

        const filepath = './assets/test-bmp/bmp_test_3x2.bmp';
        const bmpProduced = await bmpDecoderService.decodeBIntoBmp(filepath);
        expect(bmpProduced.getWidth()).to.equals(pixelsExpected[0].length);
        expect(bmpProduced.getHeight()).to.equals(pixelsExpected.length);
        expect(bmpProduced.getPixels()).to.eql(pixelsExpected);
    });

    it('decodeBIntoBmp(...) Should create an object Bmp based on bmp file of size 2x3', async () => {
        const pixelsExpected = [
            [
                { a: 0, r: 0, g: 0, b: 255 },
                { a: 0, r: 255, g: 0, b: 0 },
            ],
            [
                { a: 0, r: 0, g: 255, b: 0 },
                { a: 0, r: 255, g: 0, b: 255 },
            ],
            [
                { a: 0, r: 192, g: 192, b: 192 },
                { a: 0, r: 128, g: 128, b: 128 },
            ],
        ];

        const filepath = './assets/test-bmp/bmp_test_2x3.bmp';
        const bmpProduced = await bmpDecoderService.decodeBIntoBmp(filepath);
        expect(bmpProduced.getWidth()).to.equals(pixelsExpected[0].length);
        expect(bmpProduced.getHeight()).to.equals(pixelsExpected.length);
        expect(bmpProduced.getPixels()).to.eql(pixelsExpected);
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
        const bmpBuffer: Buffer = await fileManagerService.getFileContent(filepath);
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
        const bmpBuffer: Buffer = await fileManagerService.getFileContent(filepath);
        const bmpFile: ArrayBuffer = await bmpDecoderService.convertBufferIntoArrayBuffer(bmpBuffer);
        await expect(bmpDecoderService.decodeArrayBufferToBmp(bmpFile))
            .to.eventually.be.rejectedWith('Le décodage du bmp a échoué')
            .and.be.an.instanceOf(Error);
    });
});
