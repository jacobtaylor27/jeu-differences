import { Game } from '@app/classes/game/game';
import { PrivateGameInformation } from '@app/interface/game-info';
import { User } from '@app/interface/user';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpEncoderService } from '@app/services/bmp-encoder-service/bmp-encoder.service';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { DatabaseService } from '@app/services/database-service/database.service';
import { GameInfoService } from '@app/services/game-info-service/game-info.service';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { IdGeneratorService } from '@app/services/id-generator-service/id-generator.service';
import { Coordinate } from '@common/coordinate';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { restore, SinonSpiedInstance, stub } from 'sinon';
import { Container } from 'typedi';

describe('GameManagerService', () => {
    let bmpService: BmpService;
    let bmpSubtractorService: BmpSubtractorService;
    let bmpDifferenceService: BmpDifferenceInterpreter;
    let gameManager: GameManagerService;
    let gameInfoSpyObj: SinonSpiedInstance<GameInfoService>;
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
        const gameInfo = new GameInfoService({} as DatabaseService, bmpService, bmpSubtractorService, bmpDifferenceService, bmpEncoderService);
        const differenceService = new BmpDifferenceInterpreter();
        gameInfoSpyObj = stub(gameInfo);
        // differenceSpyObj = spy(differenceService);
        gameManager = new GameManagerService(gameInfo, differenceService);
    });

    it('should create a game', async () => {
        expect(await gameManager.createGame({ player: { name: 'test', id: '' }, isMulti: false }, 'classic', '')).to.equal(
            Array.from(gameManager['games'].values())[0].identifier,
        );
        expect(gameInfoSpyObj.getGameInfoById.called).to.equal(true);
        expect(gameManager['games'].size).not.to.equal(0);
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
        const expectedGame = stub(new Game('', { player: { name: 'test', id: '' }, isMulti: false }, {} as PrivateGameInformation));
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
        gameManager['games'].add(expectedGame);
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

    it('should check if the game is full', () => {
        const game = new Game('', { player: {} as User, isMulti: false }, {} as PrivateGameInformation);
        expect(gameManager.isGameAlreadyFull('')).to.equal(true);
        stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => game);
        const spyIsGameFull = stub(game, 'isGameFull').callsFake(() => false);
        expect(gameManager.isGameAlreadyFull('')).to.equal(false);
        spyIsGameFull.callsFake(() => true);
        expect(gameManager.isGameAlreadyFull('')).to.equal(true);
    });

    it('should add player', () => {
        const game = new Game('', { player: {} as User, isMulti: false }, {} as PrivateGameInformation);
        const spyAddPlayer = stub(game, 'addJoinPlayer');
        const spyFindGame = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => undefined);
        gameManager.addPlayer({ name: '', id: '' }, '');
        expect(spyAddPlayer.called).to.equal(false);
        spyFindGame.callsFake(() => game);
        gameManager.addPlayer({ name: '', id: '' }, '');
        expect(spyAddPlayer.called).to.equal(true);
    });

    it('should check if the game is in multiplayer', () => {
        const game = new Game('', { player: {} as User, isMulti: false }, {} as PrivateGameInformation);
        const spyFindGame = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => undefined);
        expect(gameManager.isGameMultiPlayer('')).to.equal(undefined);
        spyFindGame.callsFake(() => game);
        expect(gameManager.isGameMultiPlayer('')).to.equal(false);
        game['isMulti'] = true;
        expect(gameManager.isGameMultiPlayer('')).to.equal(true);
    });

    it('should leave game', () => {
        const game = new Game('', { player: {} as User, isMulti: false }, {} as PrivateGameInformation);
        const spyFindGame = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => undefined);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyLeaveGame = stub(game, 'leaveGame').callsFake(() => {});
        gameManager.leaveGame('', '');
        expect(spyLeaveGame.called).to.equal(false);
        spyFindGame.callsFake(() => game);
        gameManager.leaveGame('', '');
        expect(spyLeaveGame.called).to.equal(true);
    });

    it('should delete a game if all player leave', () => {
        const game = new Game('', { player: {} as User, isMulti: false }, {} as PrivateGameInformation);
        stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => game);
        const spyDeleteGame = stub(gameManager.games, 'delete');
        const spyIsAllPlayerLeave = stub(game, 'isAllPlayerLeave').callsFake(() => false);
        gameManager.leaveGame('', '');
        expect(spyDeleteGame.called).to.equal(false);
        spyIsAllPlayerLeave.callsFake(() => true);
        gameManager.leaveGame('', '');
        expect(spyDeleteGame.called).to.equal(true);
    });

    it('should return a object that represent a difference found', () => {
        const expectedDifference = { difference: { coords: [], isPlayerFoundDifference: false }, isGameOver: false, differenceLeft: 2 };
        stub(gameManager, 'isGameOver').callsFake(() => false);
        stub(gameManager, 'isDifference').callsFake(() => []);
        stub(gameManager, 'differenceLeft').callsFake(() => 2);
        expect(gameManager.differenceFound({ x: 0, y: 0 }, false, '')).to.deep.equal(expectedDifference);
    });

    afterEach(() => {
        restore();
    });
});
