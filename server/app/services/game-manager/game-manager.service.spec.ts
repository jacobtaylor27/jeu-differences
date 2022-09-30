import { SinonSpiedInstance, stub, restore } from 'sinon';
import { GameService } from '@app/services/game-info-service/game-info.service';
import { GameManagerService } from '@app/services/game-manager/game-manager.service';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { DatabaseService } from '@app/services/database-service/database.service';
import { IdGeneratorService } from '@app/services/id-generator-service/id-generator.service';
import { expect } from 'chai';
import { Game } from '@app/classes/game/game';
import { GameInfo } from '@common/game-info';

describe('GameManagerService', () => {
    let gameManager: GameManagerService;
    let gameInfoSpyObj: SinonSpiedInstance<GameService>;
    // let differenceSpyObj: SinonSpiedInstance<BmpDifferenceInterpreter>;

    beforeEach(() => {
        const gameInfo = new GameService({} as DatabaseService, {} as IdGeneratorService);
        const differenceService = new BmpDifferenceInterpreter();
        gameInfoSpyObj = stub(gameInfo);
        // differenceSpyObj = spy(differenceService);
        gameManager = new GameManagerService(gameInfo, differenceService);
    });

    it('should create a game', async () => {
        expect(await gameManager.createGame(['test'], 'classic', 0)).to.equal(gameManager['games'][0].identifier);
        expect(gameInfoSpyObj.getGameById.called).to.equal(true);
        expect(gameManager['games'].length).not.to.equal(0);
    });

    it('should check if the game is found', () => {
        const findGameSpy = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => {
            return {} as Game;
        });
        expect(gameManager.isGameFound('')).to.equal(true);
        expect(findGameSpy.called).to.equal(true);

        findGameSpy.callsFake(() => {
            return undefined;
        });
        expect(gameManager.isGameFound('')).to.equal(false);
    });

    it('should check if the game is over', () => {
        const gameFoundSpy = stub(gameManager, 'isGameFound').callsFake(() => false);
        const expectedGame = stub(new Game('', ['test'], {} as GameInfo));
        expectedGame.isGameOver.callsFake(() => false);
        stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => expectedGame);
        expect(gameManager.isGameOver('')).to.equal(null);
        expect(gameFoundSpy.called).to.equal(true);

        gameFoundSpy.callsFake(() => true);
        expect(gameManager.isGameOver('')).to.equal(false);
        expectedGame.isGameOver.callsFake(() => true);
        expect(gameManager.isGameOver('')).to.equal(true);
    });

    it('should check if the difference left', () => {
        const findGameSpy = stub(gameManager, 'isGameFound').callsFake(() => false);
        expect(gameManager.differenceLeft('')).to.equal(null);
        expect(findGameSpy.called).to.equal(true);

        findGameSpy.callsFake(() => true);
        const findSpy = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => {
            return { differenceLeft: () => true };
        });
        expect(gameManager.differenceLeft('')).equal(true);
        findSpy.callsFake(() => {
            return { differenceLeft: () => false };
        });
        expect(gameManager.differenceLeft('')).equal(false);
    });

    it('should find a game', () => {
        expect(gameManager['findGame']('')).to.equal(undefined);
        const expectedIdGame = '';
        const expectedGame = { identifier: expectedIdGame } as Game;
        gameManager['games'].push(expectedGame);
        expect(gameManager['findGame'](expectedIdGame)).to.deep.equal(expectedGame);
    });

    afterEach(() => {
        restore();
    });
});
