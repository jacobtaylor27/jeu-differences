import * as fs from 'fs';
import * as path from 'path';
import { Service } from 'typedi';

@Service()
export class FileManagerService {
    async getFileNames(filepath: string): Promise<string[]> {
        const filenames: string[] = await this.getFileNameAndExtension(filepath);
        return filenames.map((filename) => path.parse(filename).name);
    }
    async deleteFile(filepath: string): Promise<void> {
        new Promise((resolve, reject) => {
            fs.unlink(filepath, (err) => {
                if (err) {
                    reject(err);
                }
                resolve(undefined);
            });
        });
    }
    async writeFile(filepath: string, buffer: Buffer): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.writeFile(filepath, buffer, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }
    async getFileContent(filepath: string): Promise<Buffer> {
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
    private async getFileNameAndExtension(filepath: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(filepath, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    }
}
