import { BmpDecoder } from '@app/classes/bmp-decoder/bmp-decoder';
import { Bmp } from '@app/classes/bmp/bmp';
import { Pixel } from '@app/interface/pixel';
export class DifferenceBetween2Images {
    firstImagePath: string;
    secondImagePath: string;

    constructor(firstPath: string, secondPath: string) {
        this.firstImagePath = firstPath;
        this.secondImagePath = secondPath;
    }

    static async differenceBetween2Images(firstPath: string, secondPath: string): Promise<Bmp> {
        const firstBmp = await this.firstImageBmp(firstPath);
        const secondBmp = await this.secondImageBmp(secondPath);
        if (this.haveSameHeight(firstBmp.height, secondBmp.height) && this.haveSameWidth(firstBmp.width, secondBmp.width)) {
            for (let i = 0; i < firstBmp.pixels.length; i++) {
                if (this.equalPixels(firstBmp[i], secondBmp[i])) {
                    this.whitePixel(secondBmp[i]);
                }
            }
        }
        return secondBmp; 
    }

    static async firstImageBmp(firstImagePath: string): Promise<Bmp> {
        return await BmpDecoder.decode(firstImagePath);
    }
    static async secondImageBmp(secondImagePath: string): Promise<Bmp> {
        return await BmpDecoder.decode(secondImagePath);
    }
    static haveSameHeight(firstImageHeight: number, secondImageHeight: number) {
        return firstImageHeight === secondImageHeight;
    }
    static haveSameWidth(firstImageWidth: number, secondImageWidth: number): boolean {
        return firstImageWidth === secondImageWidth; 
    }
    static equalPixels(firstPixel: Pixel, secondPixel: Pixel): boolean {
        return firstPixel.a === secondPixel.a && firstPixel.b === secondPixel.b && firstPixel.g === secondPixel.g && firstPixel.r === secondPixel.r ; 
    }
    static whitePixel(pixel: Pixel): void {
        pixel.a = 0;
        pixel.b = 255;
        pixel.g = 255;
        pixel.r = 255;
    }
}
