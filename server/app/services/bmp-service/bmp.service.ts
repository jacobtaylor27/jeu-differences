import { Bmp } from '@app/classes/bmp/bmp';
import { DEFAULT_BMP_ASSET_PATH } from '@app/constants/database';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import * as fs from 'fs';
import { Service } from 'typedi';
@Service()
export class BmpService {
    constructor(private readonly bmpDecoderService: BmpDecoderService) {}

    async getAllBmps(): Promise<Bmp[]> {
        const allBmps: Bmp[] = [];
        const allPaths: string[] = await this.getFileNames(DEFAULT_BMP_ASSET_PATH);
        allPaths.forEach(async (filePath) => {
            allBmps.push(await this.bmpDecoderService.decodeBIntoBmp(filePath));
        });
        return allBmps;
    }
    async getBmpById(bmpId: string): Promise<Bmp | undefined> {
        const allPaths: string[] = await this.getFileNames(DEFAULT_BMP_ASSET_PATH);
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

    private async getFileNames(filepath: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(filepath, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    }
}
