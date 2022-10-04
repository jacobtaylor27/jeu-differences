import { Application } from '@app/app';
// import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import * as supertest from 'supertest';
import { Container } from 'typedi';

describe('Bmp Controller', () => {
    // const expectedGameId = 'test';
    let expressApp: Express.Application;

    beforeEach(async () => {
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        expressApp = app.app;
    });

    it('should get image with id', async () => {
        return supertest(expressApp).get('/api/bmp/original').expect(StatusCodes.CREATED);
    });

    it('should not get image with incorrect id', async () => {
        return supertest(expressApp).get('/api/bmp/0').expect(StatusCodes.NOT_FOUND);
    });
});
