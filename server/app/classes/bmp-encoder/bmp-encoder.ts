import { Bmp } from '@app/classes/bmp/bmp';
import { Pixel } from '@app/interface/pixel';
import * as bmp from 'bmp-js';
import * as fs from 'fs';

export class BmpEncoder {
    static encode(filename: string, bmpObj: Bmp) {
        this.assertParameters(filename);
        const width: number = bmpObj.width;
        const height: number = bmpObj.height;
        const data: Buffer = this.getBuffer(bmpObj.pixels);
        const bmpData = {
            width,
            height,
            data,
        };
        const rawData = bmp.encode(bmpData);
        fs.writeFileSync(filename, rawData.data);
    }

    private static getBuffer(pixels: Pixel[][]): Buffer {
        const rawPixels: number[] = [];

        pixels.forEach((scanLine) => {
            scanLine.forEach((pixel) => {
                rawPixels.push(pixel.a);
                rawPixels.push(pixel.r);
                rawPixels.push(pixel.g);
                rawPixels.push(pixel.b);
            });
        });
        return Buffer.from(rawPixels);
    }

    private static assertParameters(filename: string) {
        // prettier-ignore
        // eslint-disable-next-line
        if (filename.match('^.*\.(bmp)$')?.length === 0) {
            throw new Error('File extension must be a .bmp');
        }
    }
}
