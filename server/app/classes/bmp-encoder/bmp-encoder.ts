import { Bmp } from '@app/classes/bmp/bmp';
import { Pixel } from '@app/interface/pixel';
import * as bmp from 'bmp-js';

export class BmpEncoder {
    static encode(filename: string, bmpObj: Bmp) {
        const width = bmpObj.width;
        const height = bmpObj.height;
        const data = this.getBuffer(bmpObj.pixels);
        const bmpData = {
            width,
            height,
            data,
        };
        const rawData = bmp.encode(bmpData);
        // fs.WriteFileSync('./image.bmp', rawData.data);
        return rawData;
    }
    static getBuffer(pixels: Pixel[][]): Buffer {
        const rawPixels: number[] = [];

        pixels.forEach((scanLine) => {
            scanLine.forEach((pixel) => {
                rawPixels.push(pixel.a);
                rawPixels.push(pixel.r);
                rawPixels.push(pixel.g);
                rawPixels.push(pixel.b);
            });
        });
        // return new Buffer(rawPixels, 'utf8');
    }
}
