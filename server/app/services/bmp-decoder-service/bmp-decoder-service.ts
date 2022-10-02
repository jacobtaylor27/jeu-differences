import { Bmp } from '@app/classes/bmp/bmp';
import * as bmp from 'bmp-js';
import { promises as fs } from 'fs';
import { Service } from 'typedi';

@Service()
export class BmpDecoderService {
    async decodeBIntoBmp(filepath: string): Promise<Bmp> {
        if (!this.isFileExtensionValid(filepath)) throw new Error('The file should end with .bmp');
        const bmpBuffer: Buffer = await fs.readFile(filepath);
        let bmpData: bmp.BmpDecoder;
        try {
            bmpData = bmp.decode(bmpBuffer);
        } catch (e) {
            throw new Error('Le décodage du bmp a échoué');
        }
        const rawData: number[] = bmpData.data.toJSON().data;
        return new Bmp(bmpData.width, bmpData.height, rawData);
    }

    async decodeArrayBufferToBmp(arrayBuffer: ArrayBuffer): Promise<Bmp> {
        const buffer: Buffer = Buffer.alloc(arrayBuffer.byteLength);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < buffer.length; ++i) {
            buffer[i] = view[i];
        }
        let bmpData: bmp.BmpDecoder;
        try {
            bmpData = bmp.decode(buffer);
        } catch (e) {
            throw new Error('Le décodage du bmp a échoué');
        }
        return new Bmp(bmpData.width, bmpData.height, bmpData.data.toJSON().data);
    }

    async convertBufferIntoArrayBuffer(buffer: Buffer): Promise<ArrayBuffer> {
        const arrayBuffer: ArrayBuffer = new ArrayBuffer(buffer.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < buffer.length; ++i) {
            view[i] = buffer[i];
        }
        return arrayBuffer;
    }

    private isFileExtensionValid(filename: string): boolean {
        return filename.match('^.*.(bmp)$') !== null;
    }
}
