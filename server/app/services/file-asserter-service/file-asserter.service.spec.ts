import { FileAsserterService } from '@app/services/file-asserter-service/file-asserter.service';
import { expect } from 'chai';
import { describe } from 'mocha';
import { Container } from 'typedi';

describe('Date Service', () => {
    let fileAsserterService: FileAsserterService;

    beforeEach(async () => {
        fileAsserterService = Container.get(FileAsserterService);
    });

    it('isFileExtensionBmp(...) Should return false if the file is not a bitmap', async () => {
        const filepath = './assets/test-bmp/jpg_test.jpg';
        expect(await fileAsserterService.isFileExtensionBmp(filepath)).to.be.equal(false);
    });
    it('isFileExtensionBmp(...) Should return true if the file is a bitmap', async () => {
        const filepath2 = './assets/test-bmp/jpg_test.bmp';
        expect(await fileAsserterService.isFileExtensionBmp(filepath2)).to.be.equal(true);
    });
});
