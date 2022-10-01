import { Bmp } from '@app/classes/bmp/bmp';
import { DEFAULT_BMP_ASSET_PATH } from '@app/constants/database';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { BmpEncoderService } from '@app/services/bmp-encoder-service/bmp-encoder.service';
import { FileManagerService } from '@app/services/file-manager-service/file-manager.service';
import { Service } from 'typedi';
import { v4 } from 'uuid';
@Service()
export class BmpService {
    constructor(
        private readonly bmpDecoderService: BmpDecoderService,
        private readonly bmpEncoderService: BmpEncoderService,
        private readonly fileManagerService: FileManagerService,
    ) {}
    async getAllBmps(filepath: string = DEFAULT_BMP_ASSET_PATH): Promise<Bmp[]> {
        const allBmps: Bmp[] = [];
        const allFileNames: string[] = await this.fileManagerService.getFileNames(filepath);
        for (const bmpId of allFileNames) {
            const bmp: Bmp = await this.bmpDecoderService.decodeBIntoBmp(filepath + bmpId + '.bmp');
            allBmps.push(bmp);
        }
        return allBmps;
    }
    async getBmpById(bmpId: string, filepath: string = DEFAULT_BMP_ASSET_PATH): Promise<Bmp | undefined> {
        const allFileNames: string[] = await this.fileManagerService.getFileNames(filepath);
        for (const id of allFileNames) {
            if (bmpId === id) {
                return await this.bmpDecoderService.decodeBIntoBmp(filepath + bmpId + '.bmp');
            }
        }
        return undefined;
    }
    async addBmp(bpmToConvert: ArrayBuffer, filepath: string = DEFAULT_BMP_ASSET_PATH): Promise<void> {
        const decodedBmp: Bmp = await this.bmpDecoderService.decodeArrayBufferToBmp(bpmToConvert);
        const bmpId: string = v4();
        const fullpath = filepath + bmpId + '.bmp';
        await this.bmpEncoderService.encodeBmpIntoB(fullpath, decodedBmp);
    }

    async deleteBmpById(bmpId: string, filepath: string = DEFAULT_BMP_ASSET_PATH): Promise<boolean> {
        this.fileManagerService.deleteFile(filepath + bmpId + '.bmp');
        return false;
    }
}
