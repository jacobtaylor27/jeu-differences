import { Application } from '@app/app';
import { GameService } from '@app/services/game-info-service/game-info.service';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { GameValidation } from '@app/services/game-validation-service/game-validation.service';
import { Coordinate } from '@common/coordinate';
import { GameInfo } from '@common/game-info';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

describe.only('GameController', () => {
    const expectedGameId = 'test';
    let gameManager: SinonStubbedInstance<GameManagerService>;
    let gameInfo: SinonStubbedInstance<GameService>;
    let gameValidation: SinonStubbedInstance<GameValidation>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        gameManager = createStubInstance(GameManagerService);
        gameInfo = createStubInstance(GameService);
        gameValidation = createStubInstance(GameValidation);
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['gameController'], 'gameManager', { value: gameManager });
        Object.defineProperty(app['gameController'], 'gameInfo', { value: gameInfo });
        Object.defineProperty(app['gameController'], 'gameValidation', { value: gameValidation });
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

    it('should return an error if the difference query is not set', async () => {
        return supertest(expressApp).post('/api/game/difference/0').send({}).expect(StatusCodes.BAD_REQUEST);
    });

    it('should fetch all games cards of the database', async () => {
        const expectedGameCards = [{} as GameInfo, {} as GameInfo];
        gameInfo.getAllGames.resolves(expectedGameCards);
        return supertest(expressApp)
            .get('/api/game/cards')
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal({ games: expectedGameCards });
            });
    });

    it('should return nothing if the games cards is empty', async () => {
        gameInfo.getAllGames.rejects();
        return supertest(expressApp).get('/api/game/cards').expect(StatusCodes.NOT_FOUND);
    });

    it('should fetch a games card of the database', async () => {
        const expectedGameCard = {} as GameInfo;
        gameInfo.getGameById.resolves(expectedGameCard);
        return supertest(expressApp)
            .get('/api/game/cards/0')
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal({ games: expectedGameCard });
            });
    });

    it('should return Not Found if the game does not exist', async () => {
        gameInfo.getGameById.rejects();
        return supertest(expressApp).get('/api/game/cards/0').expect(StatusCodes.NOT_FOUND);
    });

    it('should return a bad request if one of the attribute needed is not here to validate a new game card', async () => {
        return supertest(expressApp).post('/api/game/card/validation').send({}).expect(StatusCodes.BAD_REQUEST);
    });

    it('should return a bad request if one of the attribute needed is not here to create a new game card', async () => {
        return supertest(expressApp).post('/api/game/card').send({}).expect(StatusCodes.BAD_REQUEST);
    });

    it('should return Not Found if a problem in the attribute is detected', async () => {
        gameValidation.isGameValid.rejects();
        const expectedBody = { original: new ArrayBuffer(0), modify: new ArrayBuffer(0), differenceRadius: 0 };
        return supertest(expressApp).post('/api/game/card/validation').send(expectedBody).expect(StatusCodes.NOT_FOUND);
    });

    it('should return Accepted if the game is valid', async () => {
        const expectedIsValid = true;
        gameValidation.isGameValid.resolves(expectedIsValid);
        const expectedBody = { original: new ArrayBuffer(0), modify: new ArrayBuffer(0), differenceRadius: 0 };
        return supertest(expressApp).post('/api/game/card/validation').send(expectedBody).expect(StatusCodes.ACCEPTED);
    });

    it('should return Not Accepted if the game is invalid', async () => {
        const expectedIsValid = false;
        gameValidation.isGameValid.resolves(expectedIsValid);
        const expectedBody = { original: new ArrayBuffer(0), modify: new ArrayBuffer(0), differenceRadius: 0 };
        return supertest(expressApp).post('/api/game/card/validation').send(expectedBody).expect(StatusCodes.NOT_ACCEPTABLE);
    });
});
