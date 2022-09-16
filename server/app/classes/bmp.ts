import { Pixel } from '@app/classes/pixel';
import { PixelOffset } from '@app/constantes/pixel-offset';
export class Bmp {
    width: number;
    height: number;
    pixels: Pixel[][];

    constructor(width: number, height: number, rawData: number[]) {
        this.height = height;
        this.width = width;
        this.pixels = this.convertRawToPixels(rawData);
    }

    convertRawToPixels(rawData: number[]): Pixel[][] {
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
