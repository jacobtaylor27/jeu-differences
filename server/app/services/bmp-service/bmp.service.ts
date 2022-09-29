import { Bmp } from '@app/classes/bmp/bmp';
import { DEFAULT_BMP_ASSET_PATH } from '@app/constants/database';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { FileManagerService } from '@app/services/file-manager-service/file-manager.service';
import { Service } from 'typedi';
@Service()
export class BmpService {
    constructor(private readonly bmpDecoderService: BmpDecoderService, private readonly fileManagerService: FileManagerService) {}

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
    async addBmp(bmp: ArrayBuffer): Promise<boolean> {
        // TODO
        console.log(bmp);
        return false;
    }

    async deleteBmpById(bmpId: string): Promise<boolean> {
        // TODO
        console.log(bmpId);
        return false;
    }
}
