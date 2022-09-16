import * as bmp from 'bmp-js';
import * as fs from 'fs';

export class Bmp {
    width: number;
    height: number;
    bmpData: bmp.BmpDecoder;

    constructor(filepath: string) {
        const bmpBuffer = fs.readFileSync(filepath);
        this.bmpData = bmp.decode(bmpBuffer);
    }
}
