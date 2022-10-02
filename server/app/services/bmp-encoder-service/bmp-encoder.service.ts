import { Bmp } from '@app/classes/bmp/bmp';
import * as bmp from 'bmp-js';
import { promises as fs } from 'fs';
import { Service } from 'typedi';

@Service()
export class BmpEncoderService {
    async encodeBmpIntoB(filepath: string, bmpObj: Bmp): Promise<void> {
        if (!(await this.isFileExtensionValid(filepath))) throw new Error('File extension must be a .bmp');
        const width: number = bmpObj.getWidth();
        const height: number = bmpObj.getHeight();
        const data: Buffer = await bmpObj.getPixelBuffer();
        const bmpData: bmp.ImageData = {
            width,
            height,
            data,
        };
        await fs.writeFile(filepath, bmp.encode(bmpData).data);
    }

    private async isFileExtensionValid(filename: string): Promise<boolean> {
        return filename.match('^.*.(bmp)$') !== null;
    }
}
