import { Bmp } from '@common/bmp';
import * as fs from 'fs';
import { Service } from 'typedi';
@Service()
export class BmpService {
    bmp: Bmp[];
    constructor() {
        this.bmp = [];
    }

    // TODO: Figure out what the heck am I suppose to do with this.
    async initialiseBmps() {
        // TODO: Aller chercher tous les fichiers dans le folder './assets/src-bmp/'
        const filebmp = fs.readFileSync('./assets/test-bmp/test_bmp_modified.bmp');
        const bmp: Bmp = {
            id: 0,
            name: 'image par défaut',
            file: filebmp,
        };
        this.addNewBmp(bmp);
    }
    // TODO: À la place de renvoyer undefined, renvoyer une erreur
    getBmpById(bmpId: number): Bmp | undefined {
        for (const bmp of this.bmp) {
            if (bmp.id === bmpId) {
                return bmp;
            }
        }
        return undefined;
    }
    addNewBmp(bmp: Bmp): boolean {
        // TODO: refactor so that it's not a bmp object that is used in parameters, but the name and the file.
        if (!this.verifyIfBmpExists(bmp.id)) {
            this.bmp.push(bmp);
            return true;
        }
        return false;
    }
    // à la place de renvoyer undefined, renvoyer une erreur
    deleteBmp(bmpId: number): Bmp | undefined {
        for (let i = 0; i < this.bmp.length; i++) {
            if (this.bmp[i].id === bmpId) {
                const nbOfElementToDelete = 1;
                return this.bmp.splice(i, nbOfElementToDelete)[0];
            }
        }
        return undefined;
    }

    private verifyIfBmpExists(bmpId: number): boolean {
        for (const bmp of this.bmp) {
            if (bmp.id === bmpId) {
                return true;
            }
        }
        return false;
    }
}
