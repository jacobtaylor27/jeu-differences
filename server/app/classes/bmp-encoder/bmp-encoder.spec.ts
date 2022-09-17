import { BmpDecoder } from '@app/classes/bmp-decoder/bmp-decoder';
import { BmpEncoder } from '@app/classes/bmp-encoder/bmp-encoder';
import { Bmp } from '@app/classes/bmp/bmp';
import { expect } from 'chai';
import * as fs from 'fs';
import { describe } from 'mocha';

describe('BmpEncoder', async () => {
    beforeEach(() => {
        const resultFilePath = './assets/test-bmp/result.bmp';
        fs.unlink(resultFilePath, () => {
            return;
        });
    });

    it('encode() should convert a Bmp into a .bmp file', async () => {
        const resultFilePath = './assets/test-bmp/result.bmp';
        const originalBmpFilePath = './assets/test-bmp/test_bmp_original.bmp';

        const bmpDecoded: Bmp = await BmpDecoder.decode(originalBmpFilePath);
        BmpEncoder.encode(resultFilePath, bmpDecoded);
        const bmpExpected: Bmp = await BmpDecoder.decode(resultFilePath);
        expect(bmpDecoded).to.eql(bmpExpected);
    });

    it('Should throw an error if the file is not a bitmap', async () => {
        const incorrectFileExtension = './assets/test-bmp/jpg_test.jpg';
        const originalBmpFilePath = './assets/test-bmp/test_bmp_original.bmp';

        const bmpDecoded: Bmp = await BmpDecoder.decode(originalBmpFilePath);
        try {
            const bmpEncoded = BmpEncoder.encode(incorrectFileExtension, bmpDecoded);
            expect(bmpEncoded).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });
});
