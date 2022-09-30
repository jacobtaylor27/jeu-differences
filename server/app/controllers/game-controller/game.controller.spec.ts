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

    it('should return the id of the new game', async () => {
        gameManager.createGame.resolves(expectedGameId);
        return supertest(expressApp)
            .post('/api/game/create/0')
            .send({ mode: 'Classic', players: ['testPlayer1'] })
            .expect(StatusCodes.CREATED)
            .then((response) => {
                expect(response.body).to.deep.equal({ id: expectedGameId });
            });
    });

    it('should return an error if createGame have a problem', async () => {
        gameManager.createGame.rejects();
        return supertest(expressApp)
            .post('/api/game/create/0')
            .send({ mode: 'Classic', players: ['testPlayer1'] })
            .expect(StatusCodes.NOT_FOUND);
    });

    it('should return an error if game query is not set', async () => {
        return supertest(expressApp).post('/api/game/create/0').send({}).expect(StatusCodes.BAD_REQUEST);
    });

    it('should return Not Found if no difference found ', async () => {
        gameManager.isGameFound.callsFake(() => true);
        gameManager.isDifference.callsFake(() => null);
        return supertest(expressApp).post('/api/game/difference/0').send({ x: 0, y: 0 }).expect(StatusCodes.NOT_FOUND);
    });

    it('should return a array of coordinate if a difference is found ', async () => {
        const expectedDifference = [{} as Coordinate];
        gameManager.isGameFound.callsFake(() => true);
        gameManager.isDifference.callsFake(() => expectedDifference as never[]);
        return supertest(expressApp)
            .post('/api/game/difference/0')
            .send({ x: 0, y: 0 })
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal({ difference: expectedDifference });
            });
    });
