import { Bmp } from '@common/bmp';
import * as fs from 'fs';
import { Service } from 'typedi';

const FILE_ROOT = './assets/src-bmp/';
@Service()
export class BmpService {
    async getBmpById(bmpId: number) {
        const filepath = FILE_ROOT + bmpId + '_bmp.bmp';
        return new Promise((resolve, reject) => {
            fs.readFile(filepath, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    }
    async addNewBmp(bmp: Bmp) {}
}
