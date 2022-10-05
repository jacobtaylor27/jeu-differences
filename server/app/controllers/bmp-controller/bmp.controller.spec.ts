import { Application } from '@app/app';
import { Bmp } from '@app/classes/bmp/bmp';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { expect } from 'chai';
// import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

describe('Bmp Controller', () => {
    // const expectedGameId = 'test';
    let expressApp: Express.Application;
    let bmpServiceSpyObj: SinonStubbedInstance<BmpService>;
    beforeEach(async () => {
        bmpServiceSpyObj = createStubInstance(BmpService);
        const app = Container.get(Application);
        Object.defineProperty(app['bmpController'], 'bmpService', { value: bmpServiceSpyObj });
        // eslint-disable-next-line dot-notation
        expressApp = app.app;
    });

    it('should get image with id', async () => {
        const expectedData = new Uint8ClampedArray();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        bmpServiceSpyObj.getBmpById
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            .callsFake(async () =>
                Promise.resolve({
                    getWidth: () => 0,
                    getHeight: () => 0,
                    toImageData: () => {
                        return { data: expectedData } as ImageData;
                    },
                } as unknown as Bmp),
            );
        return supertest(expressApp)
            .get('/api/bmp/original')
            .expect(StatusCodes.CREATED)
            .then((response) => {
                expect(response.body.width).to.equal(0);
                expect(response.body.height).to.equal(0);
                expect(response.body.data).to.deep.equal([]);
            });
    });

    it('should not get image with incorrect id', async () => {
        bmpServiceSpyObj.getBmpById.rejects();
        return supertest(expressApp).get('/api/bmp/0').expect(StatusCodes.NOT_FOUND);
    });
});
