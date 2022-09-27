import { Bmp } from '@app/classes/bmp/bmp';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { BmpEncoderService } from '@app/services/bmp-encoder-service/bmp-encoder.service';
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

        const bmpDecoded: Bmp = await bmpDecoderService.decode(originalBmpFilePath);
        await bmpEncoderService.encodeIntoBmp(resultFilePath, bmpDecoded);
        const bmpExpected: Bmp = await bmpDecoderService.decode(resultFilePath);
        expect(bmpDecoded).to.eql(bmpExpected);
    });

    it('Should throw an error if the file is not a bitmap', async () => {
        const incorrectFileExtension = './assets/test-bmp/jpg_test.jpg';
        const originalBmpFilePath = './assets/test-bmp/test_bmp_original.bmp';

        const bmpDecoded: Bmp = await bmpDecoderService.decode(originalBmpFilePath);
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

        const bmpDecoded: Bmp = await bmpDecoderService.decode(originalBmpFilePath);
        try {
            const bmpEncoded = await bmpEncoderService.encodeIntoBmp(incorrectFile, bmpDecoded);
            expect(bmpEncoded).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
        expect(fs.existsSync(incorrectFile)).to.equals(false);
    });
});
