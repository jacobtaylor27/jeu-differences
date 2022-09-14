import * as fs from 'fs';
import { Pixel } from './pixel';

export class Bmp {
    pixel: Pixel[][];

    private path: string;

    constructor(path: string) {
        this.path = path;
        this.pixel = [];
        this.init();
    }

    init() {
        fs.open('../assets/test_bmp_original.bmp', 'r', (err) => {
            if (err) throw err;
        });
    }
}
