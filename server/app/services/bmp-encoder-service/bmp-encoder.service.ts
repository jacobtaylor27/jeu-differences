import { Bmp } from '@app/classes/bmp/bmp';
import { FileManagerService } from '@app/services/file-manager-service/file-manager.service';
import * as bmp from 'bmp-js';
import { Service } from 'typedi';

@Service()
export class BmpEncoderService {
    constructor(private readonly fileManagerService: FileManagerService) {}
    async encodeBmpIntoB(filepath: string, bmpObj: Bmp): Promise<void> {
        if (!(await this.isFileExtensionValid(filepath))) throw new Error('File extension must be a .bmp');
        const width: number = bmpObj.getWidth();
        const height: number = bmpObj.getHeight();
        const data: Buffer = await bmpObj.getPixelsBuffered();
        const bmpData = {
            width,
            height,
            data,
        };
        await this.fileManagerService.writeFile(filepath, bmp.encode(bmpData).data);
    }

    private async isFileExtensionValid(filename: string): Promise<boolean> {
        return filename.match('^.*.(bmp)$') !== null;
    }
}
