import { BmpDecoder } from '@app/classes/bmp-decoder/bmp-decoder';
import { Bmp } from '@app/classes/bmp/bmp';
export class DifferenceBetween2Images {
    firstImagePath: string;
    secondImagePath: string;

    constructor(firstPath: string, secondPath: string) {
        this.firstImagePath = firstPath;
        this.secondImagePath = secondPath;
    }

    private async firstImageBmp(firstImagePath: string): Promise<Bmp> {
        return await BmpDecoder.decode(firstImagePath);
    }
    private async secondImageBmp(secondImagePath: string): Promise<Bmp> {
        return await BmpDecoder.decode(secondImagePath);
    }
}
