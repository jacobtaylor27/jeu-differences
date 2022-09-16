import { Bmp } from '@app/classes/bmp/bmp';
import * as bmp from 'bmp-js';
import * as fs from 'fs';

export class BmpDecoder {
    static async decode(filepath: string): Promise<Bmp> {
        return new Promise((resolve, reject) => {
            fs.readFile(filepath, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                const bmpData = bmp.decode(data);
                const rawData: number[] = bmpData.data.toJSON().data;
                resolve(new Bmp(bmpData.width, bmpData.height, rawData));
            });
        });
    }
}
