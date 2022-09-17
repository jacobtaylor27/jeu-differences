import { BmpDecoder } from '@app/classes/bmp-decoder/bmp-decoder';
import { BmpEncoder } from '@app/classes/bmp-encoder/bmp-encoder';
import { Bmp } from '@app/classes/bmp/bmp';
import { expect } from 'chai';
import * as fs from 'fs';
import { describe } from 'mocha';

describe('BmpEncoder', async () => {
    const FILEPATH_FOR_RESULT = './assets/test-bmp/result.bmp';
    const FILEPATH_FOR_STUB = './assets/test-bmp/test_bmp_original.bmp';
    const bmpDecoded: Bmp = await BmpDecoder.decode(FILEPATH_FOR_STUB);

    beforeEach(() => {
        fs.unlink(FILEPATH_FOR_RESULT, (_) => {});
    });

    it('encode() should convert a Bmp into a .bmp file', async () => {
        const bmpEncoded = BmpEncoder.encode(FILEPATH_FOR_RESULT, bmpDecoded);
        const bmpExpected: Bmp = await BmpDecoder.decode(FILEPATH_FOR_RESULT);
        expect(bmpEncoded).to.eql(bmpExpected);
    });

    it('Should throw an error if the file is not a bitmap', async () => {
        const incorrectFileFormat = './assets/test-bmp/jpg_test.jpg';

        try {
            const bmpEncoded = BmpEncoder.encode(incorrectFileFormat, bmpDecoded);
            expect(bmpEncoded).to.equals(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });
});
