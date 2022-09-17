import { PixelOffset } from '@app/constants/pixel-offset';
import { Pixel } from '@app/interface/pixel';
export class Bmp {
    width: number;
    height: number;
    pixels: Pixel[][];

    constructor(width: number, height: number, rawData: number[]) {
        this.height = height;
        this.width = width;
        this.pixels = this.convertRawToPixels(rawData);
    }

    private convertRawToPixels(rawData: number[]): Pixel[][] {
        const pixels = [];
        for (let i = 0; i < this.height; i++) {
            const scanLine = [];

            for (let j = 0; j < this.width; j++) {
                const PIXEL_SIZE = 4;

                const beginRange = (i * this.width + j) * PIXEL_SIZE;
                const pixel: Pixel = this.getPixel(rawData.slice(beginRange, beginRange + PIXEL_SIZE));
                scanLine.push(pixel);
            }
            pixels.push(scanLine);
        }
        console.log(pixels);
        return pixels;
    }

    private getPixel(pixel: number[]): Pixel {
        return {
            a: pixel[PixelOffset.Intensity],
            r: pixel[PixelOffset.Red],
            g: pixel[PixelOffset.Green],
            b: pixel[PixelOffset.Blue],
        };
    }
}
