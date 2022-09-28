import { Bmp } from '@app/classes/bmp/bmp';
import * as bmp from 'bmp-js';
import * as fs from 'fs';
import { Service } from 'typedi';

@Service()
export class BmpDecoderService {
    async decodeBIntoBmp(filepath: string): Promise<Bmp> {
        if (!this.isFileExtensionValid(filepath)) throw new Error('The file should end with .bmp');
        const bmpBuffer = await this.getFileContent(filepath);
        const bmpData = bmp.decode(bmpBuffer);
        const rawData: number[] = bmpData.data.toJSON().data;
        return new Bmp(bmpData.width, bmpData.height, rawData);
    }

    private async getFileContent(filepath: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            fs.readFile(filepath, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    }

    private isFileExtensionValid(filename: string): boolean {
        // prettier-ignore
        // eslint-disable-next-line
        return  filename.match('^.*\.(bmp)$') !== null;
    }
}
