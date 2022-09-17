import { BmpDecoder } from '@app/classes/bmp-decoder/bmp-decoder';
import { Bmp } from '@app/classes/bmp/bmp';
import { Pixel } from '@app/interface/pixel';
export class DifferenceBetween2Images {
    originalImagePath: string;
    modifiedImagePath: string;

    constructor(originalImagePath: string, modifiedImagePath: string) {
        this.originalImagePath = originalImagePath;
        this.modifiedImagePath = modifiedImagePath;
    }

    static async differenceBetween2Images(originalImagePath: string, modifiedImagePath: string): Promise<Bmp> {
        const originalImage = await this.produceImageBmp(originalImagePath);
        const modifiedImage = await this.produceImageBmp(modifiedImagePath);
        if (this.haveSameHeight(originalImage.height, modifiedImage.height) && this.haveSameWidth(originalImage.width, modifiedImage.width)) {
            for (let i = 0; i < originalImage.pixels.length; i++) {
                for (let j = 0; j < modifiedImage.pixels.length; j++) {
                    if (this.equalPixels(originalImage.pixels[i][j], modifiedImage.pixels[i][j])) {
                        this.whitePixel(modifiedImage.pixels[i][j]);
                    }
                }
            }
        }
        return modifiedImage; 
    }

    static async produceImageBmp(imagePath: string): Promise<Bmp> {
        return await BmpDecoder.decode(imagePath);
    }
    static haveSameHeight(originalImageHeight: number, modifiedImageHeight: number) {
        return originalImageHeight === modifiedImageHeight;
    }
    static haveSameWidth(originalImageWidth: number, modifiedImageWidth: number): boolean {
        return originalImageWidth === modifiedImageWidth;
    }
    static equalPixels(originalImage: Pixel, modifiedImage: Pixel): boolean {
        return (
            originalImage.a === modifiedImage.a &&
            originalImage.b === modifiedImage.b &&
            originalImage.g === modifiedImage.g &&
            originalImage.r === modifiedImage.r
        );
    }
    static whitePixel(pixel: Pixel): void {
        pixel.a = 0;
        pixel.b = 255;
        pixel.g = 255;
        pixel.r = 255;
    }
}
