import { Bmp } from '@app/classes/bmp/bmp';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { BmpEncoderService } from '@app/services/bmp-encoder-service/bmp-encoder.service';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import { describe } from 'mocha';
import { Container } from 'typedi';
chai.use(chaiAsPromised);

describe('Bmp encoder service', async () => {
    let bmpEncoderService: BmpEncoderService;
    let bmpDecoderService: BmpDecoderService;

    beforeEach(async () => {
        bmpEncoderService = Container.get(BmpEncoderService);
        bmpDecoderService = Container.get(BmpDecoderService);
    });

    afterEach(() => {
        const base64FileConverted = './assets/test-bmp/convertionFile.bmp';
        const resultFilePath = './assets/test-bmp/result.bmp';
        const incorrectFileExtension = './assets/test-bmp/jpg_test.jpg';
        fs.unlink(resultFilePath, () => {
            return;
        });
        fs.unlink(incorrectFileExtension, () => {
            return;
        });
        fs.unlink(base64FileConverted, () => {
            return;
        });
    });

    it('encodeIntoBmp(...) should convert a Bmp into a .bmp file', async () => {
        const resultFilePath = './assets/test-bmp/result.bmp';
        const originalBmpFilePath = './assets/test-bmp/test_bmp_original.bmp';

        const bmpDecoded: Bmp = await bmpDecoderService.decodeBIntoBmp(originalBmpFilePath);
        await bmpEncoderService.encodeBmpIntoB(resultFilePath, bmpDecoded);
        const bmpExpected: Bmp = await bmpDecoderService.decodeBIntoBmp(resultFilePath);
        expect(bmpDecoded).to.deep.equal(bmpExpected);
    });

    it('Should throw an error if the file is not a bitmap', async () => {
        const incorrectFileExtension = './assets/test-bmp/jpg_test.jpg';
        const originalBmpFilePath = './assets/test-bmp/test_bmp_original.bmp';

        const bmpDecoded: Bmp = await bmpDecoderService.decodeBIntoBmp(originalBmpFilePath);
        await expect(bmpEncoderService.encodeBmpIntoB(incorrectFileExtension, bmpDecoded))
            .to.eventually.be.rejectedWith('File extension must be a .bmp')
            .and.be.an.instanceOf(Error);
        expect(fs.existsSync(incorrectFileExtension)).to.equals(false);
    });

    it('Should throw an error if the filename entered is not accepted by fs.writeFile', async () => {
        const incorrectFile = './assets/not-existant-directory/exemple_test.bmp';
        const originalBmpFilePath = './assets/test-bmp/test_bmp_original.bmp';

        const bmpDecoded: Bmp = await bmpDecoderService.decodeBIntoBmp(originalBmpFilePath);
        await expect(bmpEncoderService.encodeBmpIntoB(incorrectFile, bmpDecoded))
            .to.eventually.be.rejectedWith(Error)
            .and.have.property('code', 'ENOENT');
        expect(fs.existsSync(incorrectFile)).to.equals(false);
    });

    it.only('should convert a file into a base64 string', async () => {
        const originalBmpFilePath = './assets/test-bmp/test_bmp_original.bmp';
        const base64String = await bmpEncoderService.base64Encode(originalBmpFilePath);
        const base64StringExpected = fs.readFileSync(originalBmpFilePath).toString('base64');
        expect(base64String).to.equal(base64StringExpected);
    });
});
