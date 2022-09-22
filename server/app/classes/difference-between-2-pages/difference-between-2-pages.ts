import { BmpDecoder } from '@app/classes/bmp-decoder/bmp-decoder';
import { Bmp } from '@app/classes/bmp/bmp';
import { Pixel } from '@app/interface/pixel';
export class BmpDifference {
    static async bmpDifference(originalImagePath: string, modifiedImagePath: string): Promise<Bmp> {
        const originalImage = await this.produceImageBmp(originalImagePath);
        const modifiedImage = await this.produceImageBmp(modifiedImagePath);
        const resultImage = await this.produceImageBmp(modifiedImagePath);
        if (
            this.isHeightEqual(originalImage.getHeight(), modifiedImage.getWidth()) &&
            this.isWidthEqual(originalImage.getHeight(), modifiedImage.getWidth())
        ) {
            for (let i = 0; i < originalImage.getPixels().length; i++) {
                for (let j = 0; j < originalImage.getPixels()[i].length; j++) {
                    if (this.arePixelsEqual(originalImage.getPixels()[i][j], modifiedImage.getPixels()[i][j])) {
                        this.whitePixel(resultImage.getPixels()[i][j]);
                    } else {
                        this.blackPixel(resultImage.getPixels()[i][j]);
                    }
                }
            }
        }
        return resultImage;
    }

    static async produceImageBmp(imagePath: string): Promise<Bmp> {
        return await BmpDecoder.decode(imagePath);
    }
    static isHeightEqual(originalImageHeight: number, modifiedImageHeight: number) {
        return originalImageHeight === modifiedImageHeight;
    }
    static isWidthEqual(originalImageWidth: number, modifiedImageWidth: number): boolean {
        return originalImageWidth === modifiedImageWidth;
    }
    static arePixelsEqual(originalImage: Pixel, modifiedImage: Pixel): boolean {
        return (
            originalImage.a === modifiedImage.a &&
            originalImage.b === modifiedImage.b &&
            originalImage.g === modifiedImage.g &&
            originalImage.r === modifiedImage.r
        );
    }
    static whitePixel(pixel: Pixel): Pixel {
        pixel.a = 0;
        pixel.b = 255;
        pixel.g = 255;
        pixel.r = 255;
        return pixel;
    }
    static blackPixel(pixel: Pixel): Pixel {
        pixel.a = 0;
        pixel.b = 0;
        pixel.g = 0;
        pixel.r = 0;
        return pixel;
    }
}
