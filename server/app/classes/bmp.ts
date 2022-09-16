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
                const pixel: Pixel = {
                    a: rawData[(i * this.width + j) * PIXEL_SIZE + PixelOffset.Intensity],
                    r: rawData[(i * this.width + j) * PIXEL_SIZE + PixelOffset.Red],
                    g: rawData[(i * this.width + j) * PIXEL_SIZE + PixelOffset.Green],
                    b: rawData[(i * this.width + j) * PIXEL_SIZE + PixelOffset.Blue],
                };
                scanLine.push(pixel);
            }
            pixels.push(scanLine);
        }
        return pixels;
    }
}
