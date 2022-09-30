import { Bmp } from '@app/classes/bmp/bmp';
import { FileManagerService } from '@app/services/file-manager-service/file-manager.service';
import * as bmp from 'bmp-js';
import { Service } from 'typedi';

@Service()
export class BmpDecoderService {
    constructor(private readonly fileManagerService: FileManagerService) {}
    async decodeBIntoBmp(filepath: string): Promise<Bmp> {
        if (!this.isFileExtensionValid(filepath)) throw new Error('The file should end with .bmp');
        const bmpBuffer: Buffer = await this.fileManagerService.getFileContent(filepath);
        const bmpData = bmp.decode(bmpBuffer);
        const rawData: number[] = bmpData.data.toJSON().data;
        return new Bmp(bmpData.width, bmpData.height, rawData);
    }

    async decodeArrayBufferToBmp(arrayBuffer: ArrayBuffer): Promise<Bmp> {
        const buffer: Buffer = Buffer.alloc(arrayBuffer.byteLength);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < buffer.length; ++i) {
            buffer[i] = view[i];
        }
        const bmpData = bmp.decode(buffer);
        const rawData: number[] = bmpData.data.toJSON().data;
        return new Bmp(bmpData.width, bmpData.height, rawData);
    }

    private async convertBufferIntoArrayBuffer(buffer: Buffer): Promise<ArrayBuffer> {
        const arrayBuffer: ArrayBuffer = new ArrayBuffer(buffer.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < buffer.length; ++i) {
            view[i] = buffer[i];
        }
        return arrayBuffer;
    }
    private isFileExtensionValid(filename: string): boolean {
        // prettier-ignore
        // eslint-disable-next-line
        return  filename.match('^.*\.(bmp)$') !== null;
    }
}
