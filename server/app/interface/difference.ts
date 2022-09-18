import { Pixel } from '@app/interface/pixel';

export interface Difference {
    x: number;
    y: number;
    originalPixel: Pixel;
    modifiedPixel: Pixel;
}
