import { Bmp } from '@app/classes/bmp/bmp';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { BmpEncoderService } from '@app/services/bmp-encoder-service/bmp-encoder.service';
import * as fs from 'fs';
import { Service } from 'typedi';

@Service()
export class BmpConverterService {
    constructor(private readonly bmpDecoderService: BmpDecoderService, private readonly bmpEncoderService: BmpEncoderService) {}
    async convertAToBmp(asciiData: string): Promise<Bmp> {
        const defaultPath = './assets/test-bmp/temporaryResult.bmp';
        try {
            await this.bmpEncoderService.encodeAIntoB(defaultPath, asciiData);
        } catch (e) {
            throw new Error('The file give was corrupted');
        }
        const bmpProduced: Bmp = await this.bmpDecoderService.decodeBIntoBmp(defaultPath);
        fs.unlink(defaultPath, () => {
            return;
        });
        return bmpProduced;
    }
}
