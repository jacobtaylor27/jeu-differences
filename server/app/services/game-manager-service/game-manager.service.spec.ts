import { Game } from '@app/classes/game/game';
import { GameStatus } from '@app/enum/game-status';
import { PrivateGameInformation } from '@app/interface/game-info';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { DatabaseService } from '@app/services/database-service/database.service';
import { GameInfoService } from '@app/services/game-info-service/game-info.service';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { IdGeneratorService } from '@app/services/id-generator-service/id-generator.service';
import { Coordinate } from '@common/coordinate';
import { User } from '@common/user';

import { BmpEncoderService } from '@app/services/bmp-encoder-service/bmp-encoder.service';
import { GameMode } from '@common/game-mode';
import { SocketEvent } from '@common/socket-event';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { restore, SinonSpiedInstance, stub, useFakeTimers } from 'sinon';
import { Server } from 'socket.io';
import { Container } from 'typedi';

describe('GameManagerService', () => {
    let clock: sinon.SinonFakeTimers;
    let bmpService: BmpService;
    let bmpSubtractorService: BmpSubtractorService;
    let bmpDifferenceService: BmpDifferenceInterpreter;
    let gameManager: GameManagerService;
    let gameInfoSpyObj: SinonSpiedInstance<GameInfoService>;
    let bmpEncoderService: BmpEncoderService;
    let idGeneratorService: sinon.SinonStubbedInstance<IdGeneratorService>;

    beforeEach(() => {
        clock = useFakeTimers();
        bmpEncoderService = Container.get(BmpEncoderService);
        bmpService = Container.get(BmpService);
        bmpSubtractorService = Container.get(BmpSubtractorService);
        bmpDifferenceService = Container.get(BmpDifferenceInterpreter);
        idGeneratorService = sinon.createStubInstance(IdGeneratorService);
        idGeneratorService['generateNewId'].callsFake(() => {
            return '5';
        });
        const gameInfo = new GameInfoService({} as DatabaseService, bmpService, bmpSubtractorService, bmpDifferenceService, bmpEncoderService);
        const differenceService = new BmpDifferenceInterpreter();
        gameInfoSpyObj = stub(gameInfo);
        gameManager = new GameManagerService(gameInfo, differenceService);
    });

    afterEach(() => {
        clock.restore();
        restore();
    });

    it('should create a game', async () => {
        expect(await gameManager.createGame({ player: { name: 'test', id: '' }, isMulti: false }, GameMode.Classic, '')).to.equal(
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

    it('should set the next game in the array', () => {
        const expectedGame = stub(
            new Game(GameMode.Classic, { player: { name: 'test', id: '' }, isMulti: false }, { id: '1' } as PrivateGameInformation),
        );
        const findGameStub = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => expectedGame);
        gameManager.setNextGame('1');
        expect(findGameStub.called).to.equal(true);
    });

    it('should set the timer', () => {
        expect(gameManager.setTimer('1')).to.equal(null);
        const findGameStub = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => expectedGame);
        const expectedGame = stub(
            new Game(GameMode.Classic, { player: { name: 'test', id: '' }, isMulti: false }, { id: '1' } as PrivateGameInformation),
        );
        gameManager.setTimer('1');
        expect(expectedGame.status).to.equal(GameStatus.InitTimer);
        expect(findGameStub.called).to.equal(true);
    });

    it('should get the timer', () => {
        expect(gameManager.getTime('')).to.equal(null);
        const expectedGame = new Game(GameMode.Classic, { player: { name: 'test', id: '' }, isMulti: false }, { id: '1' } as PrivateGameInformation);
        expectedGame.setTimer();
        /* eslint-disable @typescript-eslint/no-magic-numbers -- test with 5 seconds */
        clock.tick(5000);
        expectedGame.calculateTime();
        expect(gameManager.getTime('1')).to.equal(null);
        stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => expectedGame);

        expect(gameManager.getTime('1')).to.equal(expectedGame.seconds);
    });

    it('should check if the game is over', () => {
        const gameFoundSpy = stub(gameManager, 'isGameFound').callsFake(() => false);
        const expectedGame = stub(new Game(GameMode.Classic, { player: { name: 'test', id: '' }, isMulti: false }, {} as PrivateGameInformation));
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
        expect(gameManager.nbDifferencesLeft('')).to.equal(null);
        expect(findGameSpy.called).to.equal(true);

        findGameSpy.callsFake(() => true);
        const findSpy = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => {
            return { nbDifferencesLeft: () => true };
        });
        expect(gameManager.nbDifferencesLeft('')).equal(true);
        findSpy.callsFake(() => {
            return { nbDifferencesLeft: () => false };
        });
        expect(gameManager.nbDifferencesLeft('')).equal(false);
    });

    it('should find a game', () => {
        expect(gameManager['findGame']('')).to.equal(undefined);
        const expectedIdGame = '';
        const expectedGame = { identifier: expectedIdGame } as Game;
        gameManager['games'].set(expectedIdGame, expectedGame);
        expect(gameManager['findGame'](expectedIdGame)).to.deep.equal(expectedGame);
    });

    it('should check if the game is found and the difference is not null', () => {
        const findGameSpy = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => undefined);
        expect(gameManager.isDifference('', '', { x: 0, y: 0 })).to.deep.equal(null);
        const game = { isDifferenceFound: () => null } as unknown as Game;
        findGameSpy.callsFake(() => game);
        expect(gameManager.isDifference('', '', { x: 0, y: 0 })).to.deep.equal(null);
    });

    it('should return the difference within a specific coord', () => {
        const expectedDifferences = [{} as Coordinate];
        const game = { isDifferenceFound: () => expectedDifferences } as unknown as Game;
        const findGameSpy = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => game);
        expect(gameManager.isDifference('', '', { x: 0, y: 0 })).to.deep.equal(expectedDifferences);
        expect(findGameSpy.called).to.equal(true);
    });

    it('should check if the game is full', () => {
        const game = new Game(GameMode.Classic, { player: {} as User, isMulti: false }, {} as PrivateGameInformation);
        expect(gameManager.isGameAlreadyFull('')).to.equal(true);
        stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => game);
        const spyIsGameFull = stub(game, 'isGameFull').callsFake(() => false);
        expect(gameManager.isGameAlreadyFull('')).to.equal(false);
        spyIsGameFull.callsFake(() => true);
        expect(gameManager.isGameAlreadyFull('')).to.equal(true);
    });

    it('should add player', () => {
        const game = new Game(GameMode.Classic, { player: {} as User, isMulti: false }, {} as PrivateGameInformation);
        const spyAddPlayer = stub(game, 'addPlayer');
        const spyFindGame = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => undefined);
        gameManager.addPlayer({ name: '', id: '' }, '');
        expect(spyAddPlayer.called).to.equal(false);
        spyFindGame.callsFake(() => game);
        gameManager.addPlayer({ name: '', id: '' }, '');
        expect(spyAddPlayer.called).to.equal(true);
    });

    it('should check if player has the same name', () => {
        const stubFindGame = stub(Object.getPrototypeOf(gameManager), 'findGame');
        stubFindGame.callsFake(() => undefined);
        expect(gameManager.hasSameName('room', 'name')).to.equal(false);

        const game = new Game(GameMode.Classic, { player: {} as User, isMulti: false }, {} as PrivateGameInformation);
        stubFindGame.callsFake(() => game);
        expect(gameManager.hasSameName('room', 'name')).to.equal(false);

        game.players = new Map();
        game.players.set('id', 'name');
        expect(gameManager.hasSameName('room', 'name')).to.equal(true);
        expect(gameManager.hasSameName('room', 'test')).to.equal(false);
    });

    it('should check if the game is in multiplayer', () => {
        const game = new Game(GameMode.Classic, { player: {} as User, isMulti: false }, {} as PrivateGameInformation);
        const spyFindGame = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => undefined);
        expect(gameManager.isGameMultiplayer('')).to.equal(undefined);
        spyFindGame.callsFake(() => game);
        expect(gameManager.isGameMultiplayer('')).to.equal(false);
        game['isMulti'] = true;
        expect(gameManager.isGameMultiplayer('')).to.equal(true);
    });

    it('should leave game', () => {
        const game = new Game(GameMode.Classic, { player: {} as User, isMulti: false }, {} as PrivateGameInformation);
        const spyFindGame = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => undefined);
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spyLeaveGame = stub(game, 'leaveGame').callsFake(() => {});
        gameManager.leaveGame('', '');
        expect(spyLeaveGame.called).to.equal(false);
        spyFindGame.callsFake(() => game);
        gameManager.leaveGame('', '');
        expect(spyLeaveGame.called).to.equal(true);
    });

    it('should delete a game if all player leave', () => {
        const game = new Game(GameMode.Classic, { player: {} as User, isMulti: false }, {} as PrivateGameInformation);
        stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => game);
        const spyDeleteGame = stub(gameManager.games, 'delete');
        const spyhasNoPlayer = stub(game, 'hasNoPlayer').callsFake(() => false);
        gameManager.leaveGame('', '');
        expect(spyDeleteGame.called).to.equal(false);
        spyhasNoPlayer.callsFake(() => true);
        gameManager.leaveGame('', '');
        expect(spyDeleteGame.called).to.equal(true);
    });

    it('should return a object that represent a difference found in solo', () => {
        const expectedDifference = { coords: [], nbDifferencesLeft: 2 };
        stub(gameManager, 'isGameOver').callsFake(() => false);
        stub(gameManager, 'isDifference').callsFake(() => []);
        stub(gameManager, 'nbDifferencesLeft').callsFake(() => 2);
        expect(gameManager.getNbDifferencesFound([], '')).to.deep.equal(expectedDifference);
    });

    it('should return a object that represent a difference found in multi', () => {
        const expectedDifference = { coords: [], nbDifferencesLeft: 2, isPlayerFoundDifference: false };
        stub(gameManager, 'nbDifferencesLeft').callsFake(() => 2);
        expect(gameManager.getNbDifferencesFound([], '', false)).to.deep.equal(expectedDifference);
    });

    it('should send timer to a player', async () => {
        const spyFindGame = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => undefined);
        const expectedGame = new Game(GameMode.Classic, { player: {} as User, isMulti: false }, {} as PrivateGameInformation);
        const expectedTimer = {} as NodeJS.Timer;
        // eslint-disable-next-line no-unused-vars -- callback
        const spyInterval = stub(global, 'setInterval').callsFake((callback: (args: void) => void, ms?: number | undefined) => {
            return expectedTimer;
        });
        gameManager.sendTimer({} as Server, '', '');
        expect(spyInterval.called).to.equal(false);
        spyFindGame.callsFake(() => expectedGame);
        gameManager.sendTimer(
            {
                sockets: {
                    to: () => {
                        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake Emit and return {}
                        return { emit: () => {} };
                    },
                },
            } as unknown as Server,
            '',
            '',
        );
        expect(spyInterval.called).to.equal(true);
        expect(expectedGame.timerId).to.equal(expectedTimer);
    });
    it('should send the timer if the game is not found and the game mode is not Limited Time', () => {
        const expectedGame = new Game(GameMode.Classic, { player: {} as User, isMulti: false }, {} as PrivateGameInformation);
        stub(Object.getPrototypeOf(gameManager), 'isGameOver').callsFake(() => false);
        stub(Object.getPrototypeOf(gameManager), 'getTime').callsFake(() => 0);
        stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => expectedGame);
        gameManager.sendTimer(
            {
                sockets: {
                    to: () => {
                        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake Emit and return {}
                        return {
                            emit: (eventName: string) => {
                                expect(eventName).to.equal(SocketEvent.Clock);
                            },
                        };
                    },
                },
            } as unknown as Server,
            '',
            '',
        );

        /* eslint-disable @typescript-eslint/no-magic-numbers -- 1001 to trigger the set interval */
        clock.tick(1001);
    });
    it('should send that the game is over when 0 sec is left in Limited time gamemode', async () => {
        const expectedGame = new Game(GameMode.LimitedTime, { player: {} as User, isMulti: false }, {} as PrivateGameInformation);
        stub(Object.getPrototypeOf(gameManager), 'isGameOver').callsFake(() => true);
        stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => expectedGame);
        const spyLeaveGame = stub(Object.getPrototypeOf(gameManager), 'leaveGame').callsFake(() => expectedGame);
        const spyDeleteTimer = stub(Object.getPrototypeOf(gameManager), 'deleteTimer').callsFake(() => expectedGame);
        // eslint-disable-next-line no-unused-vars -- callback

        gameManager.sendTimer(
            {
                sockets: {
                    to: () => {
                        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake Emit and return {}
                        return { emit: () => {} };
                    },
                },
            } as unknown as Server,
            '',
            '',
        );

        /* eslint-disable @typescript-eslint/no-magic-numbers -- 1001 to trigger the set interval */
        clock.tick(1001);

        expect(spyLeaveGame.called).to.equal(true);
        expect(spyDeleteTimer.called).to.equal(true);
    });

    it('should clear a timer of a game', () => {
        const spyFindGame = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => undefined);
        const expectedGame = new Game(GameMode.Classic, { player: {} as User, isMulti: false }, {} as PrivateGameInformation);
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spyClearInterval = stub(global, 'clearInterval').callsFake(() => {});
        gameManager.deleteTimer('');
        expect(spyClearInterval.called).to.equal(false);
        spyFindGame.callsFake(() => expectedGame);
        gameManager.deleteTimer('');
        expect(spyClearInterval.called).to.equal(true);
    });

    it('should find a player', () => {
        const expectedGame = new Game(GameMode.Classic, { player: { name: 'test', id: '0' } as User, isMulti: false }, {} as PrivateGameInformation);
        const spyFindPlayer = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => undefined);
        expect(gameManager.findPlayer('', '')).to.equal(undefined);
        spyFindPlayer.callsFake(() => expectedGame);
        expect(gameManager.findPlayer('', '')).to.equal(undefined);
        expect(gameManager.findPlayer('', '0')).to.equal('test');
    });
});
