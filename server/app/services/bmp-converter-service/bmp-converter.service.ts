import { Service } from 'typedi';

@Service()
export class BmpConverterService {
    async convertAIntoBmp(asciiContent: string, filepath: string): Promise<void> {}
}
