import { Service } from 'typedi';

@Service()
export class BmpService {
    async getBmp() {
        console.log('getBmp');
    }
}
