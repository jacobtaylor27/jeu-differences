import { Bmp } from '@common/bmp';
import { Service } from 'typedi';
@Service()
export class BmpService {
    bmp: Bmp[];
    constructor() {
        this.bmp = [];
    }

    async initialiseBmps() {
        // TODO: Aller chercher tous les fichiers dans le folder './assets/src-bmp/'
    }
    getBmpById(bmpId: number): Bmp | undefined {
        for (const bmp of this.bmp) {
            if (bmp.id === bmpId) {
                return bmp;
            }
        }
        return undefined;
    }
    addNewBmp(bmp: Bmp): boolean {
        if (!this.verifyIfBmpExists(bmp.id)) {
            this.bmp.push(bmp);
            return true;
        }
        return false;
    }
    deleteBmp(bmpId: number): Bmp | undefined {}

    private verifyIfBmpExists(bmpId: number): boolean {
        for (const bmp of this.bmp) {
            if (bmp.id === bmpId) {
                return true;
            }
        }
        return false;
    }
}
