import { Application } from '@app/app';
import { GameService } from '@app/services/game-info-service/game-info.service';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { Coordinate } from '@common/coordinate';
import { GameInfo } from '@common/game-info';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

describe('GameController', () => {
    const expectedGameId = 'test';
    let gameManager: SinonStubbedInstance<GameManagerService>;
    let gameInfo: SinonStubbedInstance<GameService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        gameManager = createStubInstance(GameManagerService);
        gameInfo = createStubInstance(GameService);
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['gameController'], 'gameManager', { value: gameManager });
        Object.defineProperty(app['gameController'], 'gameInfo', { value: gameInfo });
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
        const expectedDifferenceLeft = 10;
        gameManager.isGameFound.callsFake(() => true);
        gameManager.isDifference.callsFake(() => expectedDifference);
        gameManager.isGameOver.callsFake(() => false);
        gameManager.differenceLeft.callsFake(() => expectedDifferenceLeft);
        return supertest(expressApp)
            .post('/api/game/difference/0')
            .send({ x: 0, y: 0 })
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body.difference).to.deep.equal(expectedDifference);
                expect(response.body.isGameOver).to.deep.equal(false);
                expect(response.body.differencesLeft).to.deep.equal(expectedDifferenceLeft);
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
});
