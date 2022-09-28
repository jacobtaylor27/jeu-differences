import { Bmp } from '@app/classes/bmp/bmp';
import { Pixel } from '@app/interface/pixel';
import * as bmp from 'bmp-js';
import * as fs from 'fs';
import { Service } from 'typedi';

@Service()
export class BmpEncoderService {
    async encodeIntoASCII(filepath: string) {
        if (!(await this.isFileExtensionValid(filepath))) throw new Error('File extension must be a .bmp');
        let bitmap;
        try {
            bitmap = await this.getFileContent(filepath);
        } catch (e) {
            throw new Error(e);
        }
        return Buffer.from(bitmap).toString('base64');
    }
    async encodeIntoBmp(filepath: string, bmpObj: Bmp) {
        if (!(await this.isFileExtensionValid(filepath))) throw new Error('File extension must be a .bmp');
        const width: number = bmpObj.getWidth();
        const height: number = bmpObj.getHeight();
        const data: Buffer = await this.getBuffer(bmpObj.getPixels());
        const bmpData = {
            width,
            height,
            data,
        };
        await this.writeFile(filepath, bmp.encode(bmpData).data);
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
    private async writeFile(filepath: string, buffer: Buffer): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.writeFile(filepath, buffer, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }
    private async getBuffer(pixels: Pixel[][]): Promise<Buffer> {
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
    private async isFileExtensionValid(filename: string): Promise<boolean> {
        // prettier-ignore
        // eslint-disable-next-line
        return filename.match('^.*\.(bmp)$') !== null;
    }
}
