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
    async getAllBmps(): Promise<Bmp[]> {
        const allBmps: Bmp[] = [];
        const allPaths: string[] = await this.fileManagerService.getFileNames(DEFAULT_BMP_ASSET_PATH);
        allPaths.forEach(async (filePath) => {
            allBmps.push(await this.bmpDecoderService.decodeBIntoBmp(filePath));
        });
        return allBmps;
    }
    async getBmpById(bmpId: string): Promise<Bmp | undefined> {
        const allPaths: string[] = await this.fileManagerService.getFileNames(DEFAULT_BMP_ASSET_PATH);
        for (const id of allPaths) {
            if (bmpId === id) {
                return await this.bmpDecoderService.decodeBIntoBmp(id);
            }
        }
        return undefined;
    }
    async addBmp(bpmToConvert: ArrayBuffer): Promise<void> {
        const decodedBmp: Bmp = await this.bmpDecoderService.decodeArrayBufferToBmp(bpmToConvert);
        const bmpId: string = v4();
        const filepath = DEFAULT_BMP_ASSET_PATH + bmpId;
        await this.bmpEncoderService.encodeBmpIntoB(filepath, decodedBmp);
    }

    async deleteBmpById(bmpId: string): Promise<boolean> {
        this.fileManagerService.deleteFile(DEFAULT_BMP_ASSET_PATH + bmpId + '.bmp');
        return false;
    }
}
