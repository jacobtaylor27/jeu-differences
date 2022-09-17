import { BmpDecoder } from '@app/classes/bmp-decoder/bmp-decoder';
import { BmpEncoder } from '@app/classes/bmp-encoder/bmp-encoder';
import { Bmp } from '@app/classes/bmp/bmp';
import { expect } from 'chai';
import { describe } from 'mocha';

describe('BmpEncoder', () => {
    beforeEach(() => {});
    afterEach(() => {});
    it('getBuffer() should convert a 2D array of pixels into a buffer', async () => {
        const originalFile = './assets/test-bmp/test_bmp_original.bmp';
        const bmpProduced: Bmp = await BmpDecoder.decode(originalFile);

        const producedFile = './assets/test-bmp/result.bmp';
        BmpEncoder.encode(producedFile, bmpProduced);

        const bmpExpected: Bmp = await BmpDecoder.decode(producedFile);
        expect(bmpProduced).to.eql(bmpExpected);
    });

    it('encode() should convert a Bmp into a .bmp file', () => {});
});
