import { Game } from '@app/classes/game/game';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { DatabaseService } from '@app/services/database-service/database.service';
import { GameService } from '@app/services/game-info-service/game-info.service';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { IdGeneratorService } from '@app/services/id-generator-service/id-generator.service';
import { Coordinate } from '@common/coordinate';
import { GameInfo } from '@common/game-info';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { restore, SinonSpiedInstance, stub } from 'sinon';
import { Container } from 'typedi';
import { BmpEncoderService } from '@app/services/bmp-encoder-service/bmp-encoder.service';

describe('GameManagerService', () => {
    let bmpService: BmpService;
    let bmpSubtractorService: BmpSubtractorService;
    let bmpDifferenceService: BmpDifferenceInterpreter;
    let gameManager: GameManagerService;
    let gameInfoSpyObj: SinonSpiedInstance<GameService>;
    let idGeneratorService: sinon.SinonStubbedInstance<IdGeneratorService>;
    let bmpEncoderService: BmpEncoderService;
    // let differenceSpyObj: SinonSpiedInstance<BmpDifferenceInterpreter>;

    beforeEach(() => {
        bmpService = Container.get(BmpService);
        bmpSubtractorService = Container.get(BmpSubtractorService);
        bmpDifferenceService = Container.get(BmpDifferenceInterpreter);
        idGeneratorService = sinon.createStubInstance(IdGeneratorService);
        idGeneratorService['generateNewId'].callsFake(() => {
            return '5';
        });
        bmpEncoderService = Container.get(BmpEncoderService);
        const gameInfo = new GameService(
            {} as DatabaseService,
            bmpService,
            bmpSubtractorService,
            bmpDifferenceService,
            idGeneratorService,
            bmpEncoderService,
        );
        const differenceService = new BmpDifferenceInterpreter();
        gameInfoSpyObj = stub(gameInfo);
        // differenceSpyObj = spy(differenceService);
        gameManager = new GameManagerService(gameInfo, differenceService);
    });

    it('should create a game', async () => {
        expect(await gameManager.createGame(['test'], 'classic', '')).to.equal(gameManager['games'][0].identifier);
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

    it('should check if the game is found and the difference is not null', () => {
        const findGameSpy = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => undefined);
        expect(gameManager.isDifference('', { x: 0, y: 0 })).to.deep.equal(null);
        const game = { isDifferenceFound: () => null } as unknown as Game;
        findGameSpy.callsFake(() => game);
        expect(gameManager.isDifference('', { x: 0, y: 0 })).to.deep.equal(null);
    });

    it('should return the difference within a specific coord', () => {
        const expectedDifferences = [{} as Coordinate];
        const game = { isDifferenceFound: () => expectedDifferences } as unknown as Game;
        const findGameSpy = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => game);
        expect(gameManager.isDifference('', { x: 0, y: 0 })).to.deep.equal(expectedDifferences);
        expect(findGameSpy.called).to.equal(true);
    });

    afterEach(() => {
        restore();
    });
});
