import { Application } from '@app/app';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { Coordinate } from '@common/coordinate';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

describe.only('GameController', () => {
    const expectedGameId = 'test';
    let gameManager: SinonStubbedInstance<GameManagerService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        gameManager = createStubInstance(GameManagerService);
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['gameController'], 'gameManager', { value: gameManager });
        expressApp = app.app;
    });

