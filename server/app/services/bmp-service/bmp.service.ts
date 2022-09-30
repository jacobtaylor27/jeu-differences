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
        private readonly fileManagerService: FileManagerService,
        private readonly bmpEncoderService: BmpEncoderService,
    ) {}
    async getAllBmps(filepath: string = DEFAULT_BMP_ASSET_PATH): Promise<Bmp[]> {
        const allBmps: Bmp[] = [];
        const allPaths: string[] = await this.fileManagerService.getFileNames(filepath);
        allPaths.forEach(async (filePath) => {
            allBmps.push(await this.bmpDecoderService.decodeBIntoBmp(DEFAULT_BMP_ASSET_PATH + filePath + '.bmp'));
        });
        return allBmps;
    }
    async getBmpById(bmpId: string, filepath: string = DEFAULT_BMP_ASSET_PATH): Promise<Bmp | undefined> {
        const allFileNames: string[] = await this.fileManagerService.getFileNames(filepath);
        for (const id of allFileNames) {
            if (bmpId === id) {
                return await this.bmpDecoderService.decodeBIntoBmp(filepath + id + '.bmp');
            }
        }
        return undefined;
    }
    async addBmp(bpmToConvert: ArrayBuffer, filepath: string = DEFAULT_BMP_ASSET_PATH): Promise<void> {
        const decodedBmp: Bmp = await this.bmpDecoderService.decodeArrayBufferToBmp(bpmToConvert);
        const bmpId: string = v4();
        const fullpath = filepath + bmpId;
        await this.bmpEncoderService.encodeBmpIntoB(fullpath, decodedBmp);
    }

    async deleteBmpById(bmpId: string, filepath: string = DEFAULT_BMP_ASSET_PATH): Promise<boolean> {
        this.fileManagerService.deleteFile(filepath + bmpId + '.bmp');
        return false;
    }
}
