import { Application } from '@app/app';
import { GameCarousel } from '@app/interface/game-carousel';
import { PrivateGameInformation } from '@app/interface/game-info';
import { GameInfoService } from '@app/services/game-info-service/game-info.service';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { GameValidation } from '@app/services/game-validation-service/game-validation.service';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance, stub } from 'sinon';
import { Container } from 'typedi';
import * as supertest from 'supertest';
import { GameController } from './game.controller';

describe('GameController', () => {
    let gameController: GameController;
    let gameManager: SinonStubbedInstance<GameManagerService>;
    let gameInfo: SinonStubbedInstance<GameInfoService>;
    let gameValidation: SinonStubbedInstance<GameValidation>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        gameController = Container.get(GameController);
        gameInfo = createStubInstance(GameInfoService);
        gameValidation = createStubInstance(GameValidation);
        const app = Container.get(Application);
        Object.defineProperty(app['gameController'], 'gameManager', { value: gameManager });
        Object.defineProperty(app['gameController'], 'gameInfo', { value: gameInfo });
        Object.defineProperty(app['gameController'], 'gameValidation', { value: gameValidation });
        expressApp = app.app;
    });

    it('should fetch all games cards of the database', async () => {
        const expected = {
            games: [{} as PrivateGameInformation],
            information: {
                currentPage: 1,
                gamesOnPage: 1,
                nbOfGames: 1,
                nbOfPages: 1,
                hasNext: false,
                hasPrevious: false,
            },
        } as GameCarousel;

        gameInfo.getGamesInfo.resolves(expected);
        return supertest(expressApp)
            .get('/api/game/cards/?page=1')
            .then((response) => {
                expect(response.body).to.deep.equal({});
                expect(response.body.games).to.equal(undefined);
            });
    });

    it('should return bad request when page is undefined', async () => {
        gameInfo.getGamesInfo.rejects();
        return supertest(expressApp).get('/api/game/cards/?page=').expect(StatusCodes.BAD_REQUEST);
    });

    it('should return nothing if the games cards is empty', async () => {
        gameInfo.getGamesInfo.rejects();
        return supertest(expressApp).get('/api/game/cards/?page=1').expect(StatusCodes.BAD_REQUEST);
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
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        stub(gameController['socketManager'], 'refreshGames').callsFake(() => {});
        const expectedBody = {
            original: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            modify: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            differenceRadius: 0,
            name: 'test',
        };
        return supertest(expressApp).post('/api/game/card').send(expectedBody).expect(StatusCodes.CREATED);
    });

    it('should send not found if the game is not found', async () => {
        gameInfo.deleteGameInfoById.resolves().returns(Promise.resolve(false));
        return supertest(expressApp).delete('/api/game/cards/0').expect(StatusCodes.NOT_FOUND);
    });

    it('should send not found if the game is not found', async () => {
        gameInfo.deleteGameInfoById.resolves().returns(Promise.resolve(true));
        return supertest(expressApp).delete('/api/game/cards/0').expect(StatusCodes.ACCEPTED);
    });

    it('should send bad request if there is an error while deleting the game', async () => {
        gameInfo.deleteGameInfoById.rejects();
        return supertest(expressApp).delete('/api/game/cards/0').expect(StatusCodes.BAD_REQUEST);
    });

    it('should send accepted if all the games are deleted', async () => {
        gameInfo.deleteAllGamesInfo.resolves();
        return supertest(expressApp).delete('/api/game/cards').expect(StatusCodes.ACCEPTED);
    });

    it('should send bad request if there is an error while deleting all the games', async () => {
        gameInfo.deleteAllGamesInfo.rejects();
        return supertest(expressApp).delete('/api/game/cards').expect(StatusCodes.BAD_REQUEST);
    });

    it('should reset scores for a specific game when valid', async () => {
        gameInfo.resetHighScores.resolves();
        return supertest(expressApp).patch('/api/game/scores/0/reset').expect(StatusCodes.OK);
    });

    it('should reset scores for a specific game when invalid', async () => {
        gameInfo.resetHighScores.rejects();
        return supertest(expressApp).patch('/api/game/scores/0/reset').expect(StatusCodes.NOT_FOUND);
    });

    it('should reset scores for all games when valid', async () => {
        gameInfo.resetAllHighScores.resolves();
        return supertest(expressApp).patch('/api/game/scores/reset').expect(StatusCodes.OK);
    });

    it('should reset scores for all games when invalid', async () => {
        gameInfo.resetAllHighScores.rejects();
        return supertest(expressApp).patch('/api/game/scores/reset').expect(StatusCodes.BAD_REQUEST);
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

    it('should return the scores of a specific game when valid', async () => {
        gameInfo.getHighScores.resolves({ soloScore: [], multiplayerScore: [] });
        return supertest(expressApp).get('/api/game/scores/0').expect(StatusCodes.OK);
    });

    it('should get scores and return not found when invalid', async () => {
        gameInfo.getHighScores.rejects();
        return supertest(expressApp).get('/api/game/scores/0').expect(StatusCodes.NOT_FOUND);
    });

    it('should update the scores when valid request', async () => {
        gameInfo.updateHighScores.resolves();
        return supertest(expressApp).patch('/api/game/scores/0').send({ scoresSolo: [], scoresMulti: [] }).expect(StatusCodes.OK);
    });

    it('should return bad request when invalid body request for updating the scores', async () => {
        gameInfo.updateHighScores.resolves();
        return supertest(expressApp).patch('/api/game/scores/0').send({ scoresSolo: [] }).expect(StatusCodes.BAD_REQUEST);
    });

    it('should return bad request when invalid', async () => {
        gameInfo.updateHighScores.rejects();
        return supertest(expressApp).patch('/api/game/scores/0').send({ scoresSolo: [], scoresMulti: [] }).expect(StatusCodes.BAD_REQUEST);
    });
});
