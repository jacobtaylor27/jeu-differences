import { PIXEL_DEPT } from '@app/constants/encoding';
import { PixelOffset } from '@app/enum/pixel-offset';
import { Pixel } from '@app/interface/pixel';
export class Bmp {
    private width: number;
    private height: number;
    private pixels: Pixel[][];

    constructor(width: number, height: number, rawData: number[]) {
        this.assertParameters(width, height, rawData);
        this.height = height;
        this.width = width;
        this.pixels = this.convertRawToPixels(rawData);
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    getPixels(): Pixel[][] {
        return this.pixels;
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
            r: pixel[PixelOffset.Red],
            g: pixel[PixelOffset.Green],
            b: pixel[PixelOffset.Blue],
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
