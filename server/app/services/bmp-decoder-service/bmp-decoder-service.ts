import { Bmp } from '@app/classes/bmp/bmp';
import { FileManagerService } from '@app/services/file-manager-service/file-manager.service';
import * as bmp from 'bmp-js';
import { Service } from 'typedi';

@Service()
export class BmpDecoderService {
    constructor(private readonly fileManagerService: FileManagerService) {}
    async decodeBIntoBmp(filepath: string): Promise<Bmp> {
        if (!this.isFileExtensionValid(filepath)) throw new Error('The file should end with .bmp');
        const bmpBuffer = await this.fileManagerService.getFileContent(filepath);
        const bmpData = bmp.decode(bmpBuffer);
        const rawData: number[] = bmpData.data.toJSON().data;
        return new Bmp(bmpData.width, bmpData.height, rawData);
    }

    async decodeArrayBufferToBmp(arrayBufferToDecode: ArrayBuffer): Promise<Bmp> {
        console.log(arrayBufferToDecode);
        return await this.decodeBIntoBmp('./assets/test-bmp/test_bmp_modified.bmp');
    }

    private isFileExtensionValid(filename: string): boolean {
        // prettier-ignore
        // eslint-disable-next-line
        return  filename.match('^.*\.(bmp)$') !== null;
    }
}
