import { Bmp } from '@common/bmp';
import { Service } from 'typedi';
@Service()
export class BmpService {
    async getBmpById(bmpId: number) {
        console.log(bmpId);
    }
    async addNewBmp(bmp: Bmp) {
        console.log(bmp);
    }
}
