import { Bmp } from '@app/classes/bmp/bmp';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { BmpEncoderService } from '@app/services/bmp-encoder-service/bmp-encoder.service';
import { promises as fs } from 'fs';
import { Service } from 'typedi';
import { v4 } from 'uuid';
@Service()
export class BmpService {
    constructor(private readonly bmpDecoderService: BmpDecoderService, private readonly bmpEncoderService: BmpEncoderService) {}
    async getAllBmps(filepath: string): Promise<Bmp[]> {
        const allBmps: Bmp[] = [];
        const allFileNames: string[] = [];
        for (const bmpId of allFileNames) {
            const bmp: Bmp = await this.bmpDecoderService.decodeBIntoBmp(filepath + '/' + bmpId + '.bmp');
            allBmps.push(bmp);
        }
        return allBmps;
    }
    async getBmpById(bmpId: string, filepath: string): Promise<Bmp | undefined> {
        const allFileNames: string[] = [];
        for (const id of allFileNames) {
            if (bmpId === id) {
                return await this.bmpDecoderService.decodeBIntoBmp(filepath + '/' + bmpId + '.bmp');
            }
        }
        return undefined;
    }
    async addBmp(bpmToConvert: ArrayBuffer, filepath: string): Promise<void> {
        const decodedBmp: Bmp = await this.bmpDecoderService.decodeArrayBufferToBmp(bpmToConvert);
        const bmpId: string = v4();
        const fullpath = filepath + '/' + bmpId + '.bmp';
        await this.bmpEncoderService.encodeBmpIntoB(fullpath, decodedBmp);
    }

    async deleteBmpById(bmpId: string, filepath: string): Promise<boolean> {
        fs.unlink(filepath + '/' + bmpId + '.bmp');
        return false;
    }
}
