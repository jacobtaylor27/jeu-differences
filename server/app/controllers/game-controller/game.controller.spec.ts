import { Application } from '@app/app';
import { GameInfoService } from '@app/services/game-info-service/game-info.service';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { GameValidation } from '@app/services/game-validation-service/game-validation.service';
import { Coordinate } from '@common/coordinate';
import { PrivateGameInformation } from '@app/interface/game-info';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

describe('GameController', () => {
    const expectedGameId = 'test';
    let gameManager: SinonStubbedInstance<GameManagerService>;
    let gameInfo: SinonStubbedInstance<GameInfoService>;
    let gameValidation: SinonStubbedInstance<GameValidation>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        gameManager = createStubInstance(GameManagerService);
        gameInfo = createStubInstance(GameInfoService);
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
        return supertest(expressApp).post('/api/game/difference').send({ id: '', x: 0, y: 0 }).expect(StatusCodes.NOT_FOUND);
    });

    it('should return a array of coordinate if a difference is found ', async () => {
        const expectedDifference = [{} as Coordinate];
        const expectedDifferenceLeft = 10;
        gameManager.isGameFound.callsFake(() => true);
        gameManager.isDifference.callsFake(() => expectedDifference);
        gameManager.isGameOver.callsFake(() => false);
        gameManager.differenceLeft.callsFake(() => expectedDifferenceLeft);
        return supertest(expressApp)
            .post('/api/game/difference')
            .send({ id: '', x: 0, y: 0 })
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body.difference).to.deep.equal(expectedDifference);
                expect(response.body.isGameOver).to.deep.equal(false);
                expect(response.body.differencesLeft).to.deep.equal(expectedDifferenceLeft);
            });
    });

    it('should return an error if the difference query is not set', async () => {
        return supertest(expressApp).post('/api/game/difference').send({}).expect(StatusCodes.BAD_REQUEST);
    });

    it('should fetch all games cards of the database', async () => {
        const expectedGameCards = [{} as PrivateGameInformation, {} as PrivateGameInformation];
        gameInfo.getAllGameInfos.resolves(expectedGameCards);
        return supertest(expressApp)
            .get('/api/game/cards')
            .then((response) => {
                expect(response.body).to.deep.equal({});
            });
    });

    it('should return nothing if the games cards is empty', async () => {
        gameInfo.getAllGameInfos.rejects();
        return supertest(expressApp).get('/api/game/cards').expect(StatusCodes.NOT_FOUND);
    });

    it('should fetch a games card of the database', async () => {
        const expectedGameCard = {} as PrivateGameInformation;
        gameInfo.getGameInfoById.resolves(expectedGameCard);
        return supertest(expressApp)
            .get('/api/game/cards/0')
            .expect(StatusCodes.NOT_FOUND)
            .then((response) => {
                expect(response.body).to.deep.equal({});
            });
    });

    it('should return Not Found if the game does not exist', async () => {
        gameInfo.getGameInfoById.rejects();
        return supertest(expressApp).get('/api/game/cards/0').expect(StatusCodes.NOT_FOUND);
    });

    it('should return a bad request if one of the attribute needed is not here to validate a new game card', async () => {
        return supertest(expressApp).post('/api/game/card/validation').send({}).expect(StatusCodes.BAD_REQUEST);
    });

    it('should return a bad request if one of the attribute needed is not here to create a new game card', async () => {
        return supertest(expressApp).post('/api/game/card').send({}).expect(StatusCodes.BAD_REQUEST);
    });

    it('should return Not Found if a problem in the attribute is detected', async () => {
        gameValidation.isNbDifferenceValid.rejects();
        gameValidation.numberDifference.rejects();
        const expectedBody = {
            original: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            modify: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            differenceRadius: 0,
        };
        return supertest(expressApp).post('/api/game/card/validation').send(expectedBody).expect(StatusCodes.NOT_FOUND);
    });

    it('should return Not Found if a problem in the attribute is detected', async () => {
        gameValidation.isNbDifferenceValid.rejects();
        gameValidation.numberDifference.resolves();
        const expectedBody = {
            original: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            modify: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            differenceRadius: 0,
        };
        return supertest(expressApp).post('/api/game/card/validation').send(expectedBody).expect(StatusCodes.NOT_FOUND);
    });

    it('should return Accepted if the game is valid', async () => {
        const expectedIsValid = true;
        const expectedNumberDifference = 4;
        gameValidation.isNbDifferenceValid.resolves(expectedIsValid);
        gameValidation.numberDifference.resolves(expectedNumberDifference);
        const expectedBody = {
            original: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            modify: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            differenceRadius: 0,
        };
        return supertest(expressApp)
            .post('/api/game/card/validation')
            .send(expectedBody)
            .expect(StatusCodes.ACCEPTED)
            .then((response) => expect(response.body.numberDifference).to.equal(expectedNumberDifference));
    });

    it('should return Not Accepted if the game is invalid', async () => {
        const expectedNumberDifference = 4;
        const expectedIsValid = false;
        gameValidation.isNbDifferenceValid.resolves(expectedIsValid);
        gameValidation.numberDifference.resolves(expectedNumberDifference);
        const expectedBody = {
            original: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            modify: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            differenceRadius: 0,
        };
        return supertest(expressApp)
            .post('/api/game/card/validation')
            .send(expectedBody)
            .expect(StatusCodes.NOT_ACCEPTABLE)
            .then((response) => expect(response.body.numberDifference).to.equal(expectedNumberDifference));
    });

    it('should return Accepted if the game is valid', async () => {
        const expectedIsValid = true;
        gameValidation.isNbDifferenceValid.resolves(expectedIsValid);
        gameInfo.addGameInfoWrapper.resolves();
        const expectedBody = {
            original: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            modify: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            differenceRadius: 0,
            name: 'test',
        };
        return supertest(expressApp).post('/api/game/card').send(expectedBody).expect(StatusCodes.CREATED);
    });

    it('should return Not Acceptable if the game creation has a problem', async () => {
        const expectedIsValid = true;
        gameValidation.isNbDifferenceValid.resolves(expectedIsValid);
        gameInfo.addGameInfoWrapper.rejects();
        const expectedBody = {
            original: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            modify: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            differenceRadius: 0,
            name: 'test',
        };
        return supertest(expressApp).post('/api/game/card').send(expectedBody).expect(StatusCodes.NOT_ACCEPTABLE);
    });
});
