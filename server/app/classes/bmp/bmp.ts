import { PIXEL_DEPT } from '@app/constants/encoding';
import { PixelOffset } from '@app/enum/pixel-offset';
import { Pixel } from '@app/interface/pixel';
export class Bmp {
    width: number;
    height: number;
    pixels: Pixel[][];

    constructor(width: number, height: number, rawData: number[]) {
        this.assertParameters(width, height, rawData);
        this.height = height;
        this.width = width;
        this.pixels = this.convertRawToPixels(rawData);
    }

    private convertRawToPixels(rawData: number[]): Pixel[][] {
        const pixels = [];
        for (let i = 0; i < this.height; i++) {
            const scanLine = [];

            for (let j = 0; j < this.width; j++) {
                const beginRange = (i * this.width + j) * PIXEL_DEPT;
                const pixel: Pixel = this.getPixel(rawData.slice(beginRange, beginRange + PIXEL_DEPT));
                scanLine.push(pixel);
            }
            pixels.push(scanLine);
        }
        return pixels;
    }

    private getPixel(pixel: number[]): Pixel {
        return {
            a: pixel[PixelOffset.Intensity],
            b: pixel[PixelOffset.Red],
            g: pixel[PixelOffset.Green],
            r: pixel[PixelOffset.Blue],
        };
    }

    private assertParameters(width: number, height: number, rawData: number[]): void {
        if (width <= 0 || height <= 0) {
            throw new RangeError();
        }
        if (rawData.length !== PIXEL_DEPT * height * width) {
            throw new RangeError();
        }
    }
}
