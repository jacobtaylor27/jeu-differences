import { PIXEL_COLOR } from '@app/constants/pixel-color';

export class Pixel {
    r: number;
    g: number;
    b: number;
    a: number;

    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = 0;
    }

    isWhite() {
        return this.isColor(PIXEL_COLOR.white);
    }

    isBlack() {
        return this.isColor(PIXEL_COLOR.black);
    }

    setWhite() {
        this.setColor(PIXEL_COLOR.white);
    }

    setBlack() {
        this.setColor(PIXEL_COLOR.black);
    }

    private isColor(color: number) {
        return this.r === color && this.g === color && this.b === color;
    }

    private setColor(color: number) {
        this.b = color;
        this.g = color;
        this.r = color;
    }
}
