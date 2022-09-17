import { Bmp } from '@app/classes/bmp/bmp';
import { Pixel } from '@app/interface/pixel';
import * as bmp from 'bmp-js';
import * as fs from 'fs';

export class BmpEncoder {
    static async encode(filepath: string, bmpObj: Bmp) {
        if (!this.isFileExtensionValid(filepath)) throw new Error('File extension must be a .bmp');
        const width: number = bmpObj.getWidth();
        const height: number = bmpObj.getHeight();
        const data: Buffer = this.getBuffer(bmpObj.getPixels());
        const bmpData = {
            width,
            height,
            data,
        };
        fs.writeFileSync(filepath, bmp.encode(bmpData).data);
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

    private static isFileExtensionValid(filename: string): boolean {
        // prettier-ignore
        // eslint-disable-next-line
        return filename.match('^.*\.(bmp)$') !== null;
    }
}
