export class Bmp {
    width: number;
    height: number;
    rawData: number[];

    constructor(width: number, height: number, rawData: number[]) {
        this.height = height;
        this.width = width;
        this.rawData = rawData;
    }
}
