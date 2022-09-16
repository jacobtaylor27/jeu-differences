import { Pixel } from '@app/classes/pixel';

const COLOR_PER_PIXEL = 3;
const LONG_SIZE = 4;

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
        const padding = this.width % LONG_SIZE;
        const pixels = [];

        for (let i = 0; i < this.height; i++) {
            const scanLine = [];

            for (let j = 0; j < this.width; j++) {
                const pixel: Pixel = {
                    r: rawData[(i * this.width + this.height) * COLOR_PER_PIXEL],
                    g: rawData[(i * this.width + this.height) * COLOR_PER_PIXEL + 1],
                    b: rawData[(i * this.width + this.height) * COLOR_PER_PIXEL + 2],
                };
                scanLine.push(pixel);
            }
            for (let j = 0; j < padding; j++) {
                scanLine.pop();
            }

            pixels.push(scanLine);
        }
        return pixels;
    }
}
