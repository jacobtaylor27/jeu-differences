import { Pixel } from '@app/classes/pixel/pixel';
import { PIXEL_DEPT } from '@app/constants/encoding';
import { PIXEL_OFFSET } from '@app/constants/pixel-offset';
import * as bmp from 'bmp-js';
import { Buffer } from 'buffer';
export class Bmp {
    private width: number;
    private height: number;
    private pixels: Pixel[][];

    constructor(width: number, height: number, rawData: number[]) {
        this.assertParameters(width, height, rawData);
        this.pixels = this.convertRawToPixels(rawData, width, height);
        this.height = height;
        this.width = width;
    }

    async toImageData(): Promise<ImageData> {
        const imageData: ImageData = {
            colorSpace: 'srgb',
            width: this.width,
            height: this.height,
            data: new Uint8ClampedArray(await this.getPixelBuffer()),
        };
        return imageData;
    }

    async toBmpImageData(): Promise<bmp.ImageData> {
        const imageData: bmp.ImageData = {
            width: this.width,
            height: this.height,
            data: await this.getPixelBuffer(),
        };
        return bmp.encode(imageData);
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

    private async getPixelBuffer(): Promise<Buffer> {
        const rawPixels: number[] = Pixel.convertPixelsToRaw(this.pixels);
        return Buffer.from(rawPixels);
    }

    private convertRawToPixels(rawData: number[], width: number, height: number): Pixel[][] {
        const pixels = [];
        for (let i = 0; i < height; i++) {
            const scanLine = [];

            for (let j = 0; j < width; j++) {
                const beginRange = (i * width + j) * PIXEL_DEPT;
                const pixel: Pixel = this.getPixel(rawData.slice(beginRange, beginRange + PIXEL_DEPT));
                scanLine.push(pixel);
            }
            pixels.push(scanLine);
        }
        return pixels;
    }

    private getPixel(pixelBuffered: number[]): Pixel {
        return new Pixel(pixelBuffered[PIXEL_OFFSET.red], pixelBuffered[PIXEL_OFFSET.green], pixelBuffered[PIXEL_OFFSET.blue]);
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
