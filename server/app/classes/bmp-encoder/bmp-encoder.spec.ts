import { BmpDecoder } from '@app/classes/bmp-decoder/bmp-decoder';
import { BmpEncoder } from '@app/classes/bmp-encoder/bmp-encoder';
import { Bmp } from '@app/classes/bmp/bmp';
import { expect } from 'chai';
import * as fs from 'fs';
import { describe } from 'mocha';

describe('BmpEncoder', () => {
    const FILENAME_FOR_TESTING = './assets/test-bmp/result.bmp';
    beforeEach(() => {
        fs.unlink(FILENAME_FOR_TESTING, (_) => {});
    });
    it('getBuffer() should convert a 2D array of pixels into a buffer', async () => {
        const originalFile = './assets/test-bmp/test_bmp_original.bmp';
        const bmpProduced: Bmp = await BmpDecoder.decode(originalFile);
        BmpEncoder.encode(FILENAME_FOR_TESTING, bmpProduced);

        const bmpExpected: Bmp = await BmpDecoder.decode(FILENAME_FOR_TESTING);
        expect(bmpProduced).to.eql(bmpExpected);
    });

    it('encode() should convert a Bmp into a .bmp file', () => {});
});
