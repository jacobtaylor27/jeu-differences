import { Bmp } from '@app/classes/bmp/bmp';
import * as bmp from 'bmp-js';
import * as fs from 'fs';

export class BmpDecoder {
    static async decode(filepath: string): Promise<Bmp> {
        this.assertParameters(filepath);
        const bmpBuffer = await this.getFileContent(filepath);
        const bmpData = bmp.decode(bmpBuffer);
        const rawData: number[] = bmpData.data.toJSON().data;
        return new Bmp(bmpData.width, bmpData.height, rawData);
    }

    private static async getFileContent(filepath: string): Promise<Buffer> {
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

    private static assertParameters(filepath: string) {
        // prettier-ignore
        // eslint-disable-next-line
        const reg = new RegExp('^.*\.(bmp)$');
        if (filepath.match(reg) === null) {
            throw new Error('File extension must be a .bmp');
        }
    }
}
