import { FileManagerService } from '@app/services/file-manager-service/file-manager.service';
import { expect } from 'chai';
import { describe } from 'mocha';
import { Container } from 'typedi';

describe('File Manager Service', async () => {
    let fileManagerService: FileManagerService;

    beforeEach(async () => {
        fileManagerService = Container.get(FileManagerService);
    });

    it('getFileNames(path) should return the proper file names in a directory', async () => {
        const testDirectory = './assets/test-dir/';
        const fileNames: string[] = await fileManagerService.getFileNames(testDirectory);
        expect(fileNames[0]).to.equal('bmp_test_2x2.bmp');
        expect(fileNames[1]).to.equal('test_bmp_modified.bmp');
    });

    it("getFileNames(path) should throw an exception when given a path that doesn't exists", async () => {});
});
