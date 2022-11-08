import { Bmp } from '@app/classes/bmp/bmp';
import { BMP_EXTENSION, ID_PREFIX } from '@app/constants/database';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { IdGeneratorService } from '@app/services/id-generator-service/id-generator.service';
import * as bmp from 'bmp-js';
import * as fs from 'fs';
import * as path from 'path';
import { Service } from 'typedi';
@Service()
export class BmpService {
    constructor(private readonly bmpDecoderService: BmpDecoderService, private readonly idGeneratorService: IdGeneratorService) {}
    async getAllBmps(filepath: string): Promise<Bmp[]> {
        const allBmps: Bmp[] = [];
        const files: string[] = await fs.promises.readdir(filepath);
        for (const file of files) {
            if (file.includes(ID_PREFIX)) {
                const fileToAdd = file.slice(0, -BMP_EXTENSION.length).slice(ID_PREFIX.length);
                allBmps.push(await this.getBmpById(fileToAdd, filepath));
            }
        }
        return allBmps;
    }
    async getBmpById(bmpId: string, filepath: string): Promise<Bmp> {
        const fullpath: string = path.join(filepath, ID_PREFIX + bmpId + BMP_EXTENSION);
        if (!fs.existsSync(fullpath)) throw new Error("Couldn't get the bmp by id");
        return await this.bmpDecoderService.decodeBIntoBmp(fullpath);
    }
    async addBmp(bpmToConvert: ImageData, filepath: string): Promise<string> {
        const bmpData = {
            data: Buffer.from(await Bmp.convertRGBAToARGB(Array.from(bpmToConvert.data))),
            width: bpmToConvert.width,
            height: bpmToConvert.height,
        };

        const rawData = bmp.encode(bmpData);
        const bmpId: string = this.idGeneratorService.generateNewId();
        const fullpath = path.join(filepath, ID_PREFIX + bmpId + BMP_EXTENSION);
        if (!fs.existsSync(filepath)) {
            await fs.promises.mkdir(filepath);
        }
        await fs.promises.writeFile(fullpath, rawData.data);
        return bmpId;
    }

    async deleteGameImages(imageIds: string[], filepath: string): Promise<void> {
        for (const imageId of imageIds) {
            await fs.promises.unlink(path.join(filepath, ID_PREFIX + imageId + BMP_EXTENSION));
        }
    }

    async deleteAllSourceImages(filepath: string): Promise<void> {
        const files: string[] = await fs.promises.readdir(filepath);
        const filesToDelete: string[] = [];

        for (const file of files) {
            if (file.includes(ID_PREFIX)) {
                filesToDelete.push(file.slice(0, -BMP_EXTENSION.length).slice(ID_PREFIX.length));
            }
        }

        await this.deleteGameImages(filesToDelete, filepath);
    }
}
