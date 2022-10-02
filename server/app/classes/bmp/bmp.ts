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
    static convertPixelsToRaw(pixelMatrix: Pixel[][]): number[] {
        const raw: number[] = [];
        pixelMatrix.forEach((lineOfPixels) => {
            lineOfPixels.forEach((pixel) => {
                raw.push(pixel.a);
                raw.push(pixel.r);
                raw.push(pixel.g);
                raw.push(pixel.b);
            });
        });
        return raw;
    }

    async getPixelBuffer(): Promise<Buffer> {
        const rawPixels: number[] = Bmp.convertPixelsToRaw(this.pixels);
        return Buffer.from(rawPixels);
    }

    async toImageData(): Promise<ImageData> {
        const width: number = this.width;
        const height = this.height;
        const data = JSON.parse((await this.getPixelBuffer()).toString());
        const colorSpace = 'srgb';
        const imageData: ImageData = {
            colorSpace,
            width,
            height,
            data,
        };
        return imageData;
    }

    async toBmpImageData(): Promise<bmp.ImageData> {
        const width: number = this.width;
        const height = this.height;
        const data = await this.getPixelBuffer();
        const imageData: bmp.ImageData = {
            width,
            height,
            data,
        };
        return imageData;
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
