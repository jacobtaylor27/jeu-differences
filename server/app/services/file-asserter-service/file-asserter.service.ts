import { Service } from 'typedi';

@Service()
export class FileAsserterService {
    async isFileExtensionBmp(filename: string): Promise<boolean> {
        // prettier-ignore
        // eslint-disable-next-line
        return  filename.match('^.*\.(bmp)$') !== null;
    }
}
