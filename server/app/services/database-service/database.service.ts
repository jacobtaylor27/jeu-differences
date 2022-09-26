import { Service } from 'typedi';

@Service()
export class DatabaseService {
    constructor() {}
    async initialise(): Promise<void> {}
}
