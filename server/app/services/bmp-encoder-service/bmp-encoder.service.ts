import { Bmp } from '@app/classes/bmp/bmp';
import { Pixel } from '@app/interface/pixel';
import { FileManagerService } from '@app/services/file-manager-service/file-manager.service';
import * as bmp from 'bmp-js';
import { Service } from 'typedi';

@Service()
export class BmpEncoderService {
    constructor(private readonly fileManagerService: FileManagerService) {}
    async encodeBmpIntoB(filepath: string, bmpObj: Bmp) {
        if (!(await this.isFileExtensionValid(filepath))) throw new Error('File extension must be a .bmp');
        const width: number = bmpObj.getWidth();
        const height: number = bmpObj.getHeight();
        const data: Buffer = await this.getBuffer(bmpObj.getPixels());
        const bmpData = {
            width,
            height,
            data,
        };
        await this.fileManagerService.writeFile(filepath, bmp.encode(bmpData).data);
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
