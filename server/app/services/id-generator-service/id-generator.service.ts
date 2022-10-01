import { Service } from 'typedi';
import { v4 } from 'uuid';

@Service()
export class IdGeneratorService {
    async getNewId(): Promise<string> {
        return v4();
    }
}
