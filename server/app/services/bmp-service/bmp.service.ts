import { Bmp } from '@common/bmp';
import { Service } from 'typedi';
@Service()
export class BmpService {
    getBmpById(bmpId: number) {}
    addNewBmp(bmp: Bmp) {}
    deleteBmp(bmpId: number) {}
}
