import { Bmp } from '@app/classes/bmp/bmp';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { BmpEncoderService } from '@app/services/bmp-encoder-service/bmp-encoder.service';
import * as fs from 'fs';
import * as path from 'path';
import { Service } from 'typedi';
import { v4 } from 'uuid';
@Service()
export class BmpService {
    constructor(private readonly bmpDecoderService: BmpDecoderService, private readonly bmpEncoderService: BmpEncoderService) {}
    async getAllBmps(filepath: string): Promise<Bmp[]> {
        const allBmps: Bmp[] = [];
        return allBmps;
    }
    async getBmpById(bmpId: string, filepath: string): Promise<Bmp> {
        const fullpath: string = path.join(filepath, bmpId + '.bmp');
        console.log(fullpath);
        if (!fs.existsSync(fullpath)) throw new Error("Couldn't get the bmp by id");
        return await this.bmpDecoderService.decodeBIntoBmp(fullpath);
    }
    async addBmp(bpmToConvert: ArrayBuffer, filepath: string): Promise<void> {
        const decodedBmp: Bmp = await this.bmpDecoderService.decodeArrayBufferToBmp(bpmToConvert);
        const bmpId: string = v4();
        const fullpath = path.join(filepath, bmpId + '.bmp');
        await this.bmpEncoderService.encodeBmpIntoB(fullpath, decodedBmp);
    }
    async deleteBmpById(bmpId: string, filepath: string): Promise<boolean> {
        await fs.promises.unlink(path.join(filepath, bmpId + '.bmp'));
        return false;
    }
}
