import { Bmp } from '@app/classes/bmp/bmp';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { BmpEncoderService } from '@app/services/bmp-encoder-service/bmp-encoder.service';
import { EXPECTED_ENCODED_ASCII } from '@app/services/bmp-encoder-service/bmp-encoder.service.constant.spec';
import { expect } from 'chai';
import * as fs from 'fs';
import { describe } from 'mocha';

describe('BmpEncoder', async () => {
    let bmpEncoderService: BmpEncoderService;
    let bmpDecoderService: BmpDecoderService;

    beforeEach(async () => {
        bmpEncoderService = new BmpEncoderService();
        bmpDecoderService = new BmpDecoderService();
    });

    afterEach(() => {
        const resultFilePath = './assets/test-bmp/result.bmp';
        const incorrectFileExtension = './assets/test-bmp/jpg_test.jpg';
        fs.unlink(resultFilePath, () => {
            return;
        });
        fs.unlink(incorrectFileExtension, () => {
            return;
        });
    });

    it('encodeIntoBmp() should convert a Bmp into a .bmp file', async () => {
        const resultFilePath = './assets/test-bmp/result.bmp';
        const originalBmpFilePath = './assets/test-bmp/test_bmp_original.bmp';

        const bmpDecoded: Bmp = await bmpDecoderService.decodeIntoBmp(originalBmpFilePath);
        await bmpEncoderService.encodeIntoBmp(resultFilePath, bmpDecoded);
        const bmpExpected: Bmp = await bmpDecoderService.decodeIntoBmp(resultFilePath);
        expect(bmpDecoded).to.deep.equal(bmpExpected);
    });

    it('encodeIntoASCII() should convert a Bmp into a base64 string', async () => {
        const filepath = './assets/test-bmp/test_bmp_original.bmp';
        const encodedImg = await bmpEncoderService.encodeIntoASCII(filepath);
        expect(encodedImg).to.deep.equal(EXPECTED_ENCODED_ASCII);
    });

    it('encodeIntoASCII() should throw an error if the file extension is not correct', async () => {
        const filepath = './assets/test-bmp/test_bmp_original.jpg';
        try {
            const encodedImg = await bmpEncoderService.encodeIntoASCII(filepath);
            expect(encodedImg).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });

    it("encodeAIntoBmp(...) should throw an error if the file doesn't exists", async () => {
        const filepath = './assets/impossible-file-ath/something.bmp';
        try {
            const encodedImg = await bmpEncoderService.encodeAIntoBmp(filepath, EXPECTED_ENCODED_ASCII);
            expect(encodedImg).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });

    it("encodeAIntoBmp(...) should throw an error if the file path doesn't end with .bmp", async () => {
        const filepath = './assets/src-bmp/result.jpg';
        try {
            const encodedImg = await bmpEncoderService.encodeAIntoBmp(filepath, EXPECTED_ENCODED_ASCII);
            expect(encodedImg).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });

    it('encodeIntoASCII(...) should produce a .bmp', async () => {
        const filepath = './assets/src-bmp/result.bmp';
        await bmpEncoderService.encodeAIntoBmp(filepath, EXPECTED_ENCODED_ASCII);
        const encodedASCII = await bmpEncoderService.encodeIntoASCII(filepath);
        expect(encodedASCII).to.deep.equal(EXPECTED_ENCODED_ASCII);
    });

    it("should throw an error if the file doesn't exists", async () => {
        const filepath = './assets/impossible-file-ath/something.bmp';
        try {
            const encodedImg = await bmpEncoderService.encodeIntoASCII(filepath);
            expect(encodedImg).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });

    it('Should throw an error if the file is not a bitmap', async () => {
        const incorrectFileExtension = './assets/test-bmp/jpg_test.jpg';
        const originalBmpFilePath = './assets/test-bmp/test_bmp_original.bmp';

        const bmpDecoded: Bmp = await bmpDecoderService.decodeIntoBmp(originalBmpFilePath);
        try {
            const bmpEncoded = await bmpEncoderService.encodeIntoBmp(incorrectFileExtension, bmpDecoded);
            expect(bmpEncoded).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
        expect(fs.existsSync(incorrectFileExtension)).to.equals(false);
    });

    it('Should throw an error if the filename entered is not accepted by fs.writeFile', async () => {
        const incorrectFile = './assets/not-existant-directory/exemple_test.bmp';
        const originalBmpFilePath = './assets/test-bmp/test_bmp_original.bmp';

        const bmpDecoded: Bmp = await bmpDecoderService.decodeIntoBmp(originalBmpFilePath);
        try {
            const bmpEncoded = await bmpEncoderService.encodeIntoBmp(incorrectFile, bmpDecoded);
            expect(bmpEncoded).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
        expect(fs.existsSync(incorrectFile)).to.equals(false);
    });
});
