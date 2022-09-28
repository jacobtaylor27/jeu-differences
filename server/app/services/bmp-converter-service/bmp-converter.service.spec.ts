import { Bmp } from '@app/classes/bmp/bmp';
import { BmpConverterService } from '@app/services/bmp-converter-service/bmp-converter.service';
import { CORRUPTED_ENCODED_ASCII, EXPECTED_ENCODED_ASCII } from '@app/services/bmp-converter-service/bmp-converter.service.constant.spec';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { BmpEncoderService } from '@app/services/bmp-encoder-service/bmp-encoder.service';
import { expect } from 'chai';
import * as fs from 'fs';
import { describe } from 'mocha';

describe('Bmp converter service', () => {
    let bmpConverterService: BmpConverterService;
    let bmpDecoderService: BmpDecoderService;
    let bmpEncoderService: BmpEncoderService;

    beforeEach(async () => {
        bmpDecoderService = new BmpDecoderService();
        bmpEncoderService = new BmpEncoderService();
        bmpConverterService = new BmpConverterService(bmpDecoderService, bmpEncoderService);
    });

    it('convertAToBmp(...) should return a bmp object when given a correct string in base64', async () => {
        const resultingBmp: Bmp = await bmpConverterService.convertAToBmp(EXPECTED_ENCODED_ASCII);
        const expectedBmp: Bmp = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test_bmp_original.bmp');
        expect(resultingBmp).to.deep.equal(expectedBmp);
    });
    it('convertAToBmp(...) should return a bmp object when given a correct string in base64', async () => {
        try {
            const bmpProduced: Bmp = await bmpConverterService.convertAToBmp(CORRUPTED_ENCODED_ASCII);
            expect(bmpProduced).to.be.instanceof(undefined);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });
    it('convertAToBmp(...) should not produce any file in the temp folder', async () => {
        const defaultPath = './assets/test-bmp/temporaryResult.bmp';
        const bmpProduced: Bmp = await bmpConverterService.convertAToBmp(CORRUPTED_ENCODED_ASCII);
        expect(bmpProduced).to.not.be.instanceOf(undefined);
        expect(fs.existsSync(defaultPath)).to.equals(false);
    });
});
