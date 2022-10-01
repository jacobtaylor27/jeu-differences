import { Coordinate } from '@common/coordinate';
import { GameInfo } from '@common/game-info';
import { Score } from '@common/score';
import { Game } from '@app/classes/game/game';
import { expect } from 'chai';
import { GameMode } from '@app/enum/game-mode';
import { InitGameState } from '@app/classes/init-game-state/init-game-state';
import { stub, spy } from 'sinon';
import { PlayerOneTourState } from '@app/classes/player-one-tour-state/player-one-tour-state';
import { GameStatus } from '@app/enum/game-status';

describe('Game', () => {
    let game: Game;
    const expectedGameInfo: GameInfo = {
        idOriginalBmp: 0,
        idEditedBmp: 1,
        idDifferenceBmp: 2,
        soloScore: [{} as Score],
        multiplayerScore: [{} as Score],
        name: 'test game',
        differences: [[{} as Coordinate]],
    };
    const expectedPlayers = ['test player'];
    const expectedMode = 'classic';
    beforeEach(() => {
        game = new Game(expectedMode, expectedPlayers, expectedGameInfo);
    });

    it('should create a game with specific mode, players and game information', () => {
        const expectedGameState = new PlayerOneTourState();
        const newGame = new Game(expectedMode, expectedPlayers, expectedGameInfo);
        expect(newGame.information).to.deep.equal(expectedGameInfo);
        expect(newGame['players']).to.deep.equal(expectedPlayers);
        expect(newGame['differenceFound']).to.deep.equal(new Set<Coordinate[]>());
        expect(newGame['context'].gameMode).to.equal(expectedMode as GameMode);
        expect(newGame['context'].gameState()).to.equal(expectedGameState.status());
    });

    it('should get the id of the game', () => {
        expect(game.identifier).to.equal(game['id']);
    });

    it('should get the information of the game', () => {
        expect(game.information).to.equal(expectedGameInfo);
    });

    it('should get the status of the game', () => {
        const expectGameState = new InitGameState();
        const stateSpyObj = stub(game['context'], 'gameState').callsFake(() => expectGameState.status());
        game.status();
        expect(stateSpyObj.called).to.equal(true);
        expect(game.status()).to.equal(expectGameState.status());
    });

    it('should go to the next state of the game', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const stateSpyObj = stub(game['context'], 'next').callsFake(() => {});
        game.next();
        expect(stateSpyObj.called).to.equal(true);
    });

    it('should check if the game is on initialize', () => {
        const stateSpyObj = stub(game['context'], 'gameState').callsFake(() => GameStatus.InitGame);
        expect(game.isGameInitialize()).to.equal(true);
        expect(stateSpyObj.called).to.equal(true);
        stateSpyObj.callsFake(() => GameStatus.InitTimer);
        expect(game.isGameInitialize()).to.equal(true);
        stateSpyObj.callsFake(() => GameStatus.EndGame);
        expect(game.isGameInitialize()).to.equal(false);
    });

    it('should check if the game is over', () => {
        const stateSpyObj = stub(game['context'], 'gameState').callsFake(() => GameStatus.InitGame);
        expect(game.isGameOver()).to.equal(false);
        expect(stateSpyObj.called).to.equal(true);
        stateSpyObj.callsFake(() => GameStatus.InitTimer);
        expect(game.isGameOver()).to.equal(false);
        stateSpyObj.callsFake(() => GameStatus.EndGame);
        expect(game.isGameOver()).to.equal(true);
    });

    it('should get the number of difference not found', () => {
        const expectedDifference = { length: 10 } as Coordinate[][];
        const expectedDifferenceFound = { size: 5 } as Set<Coordinate[]>;
        game['info'].differences = expectedDifference;
        game['differenceFound'] = expectedDifferenceFound;
        expect(game.differenceLeft()).to.equal(expectedDifference.length - expectedDifferenceFound.size);
    });

    it('before check if all difference found check if the game is on init or over', () => {
        const initSpy = stub(game, 'isGameInitialize').callsFake(() => false);
        const overSpy = stub(game, 'isGameOver').callsFake(() => false);
        expect(game.isAllDifferenceFound()).to.equal(false);
        expect(initSpy.called).to.equal(true);
        expect(overSpy.called).to.equal(true);

        initSpy.callsFake(() => true);
        overSpy.callsFake(() => false);
        expect(game.isAllDifferenceFound()).to.equal(false);

        initSpy.callsFake(() => false);
        overSpy.callsFake(() => true);
        expect(game.isAllDifferenceFound()).to.equal(true);
    });

    it('should check if all difference is found', () => {
        stub(game, 'isGameInitialize').callsFake(() => false);
        stub(game, 'isGameOver').callsFake(() => false);
        let expectedDifference = { length: 10 } as Coordinate[][];
        let expectedDifferenceFound = { size: 5 } as Set<Coordinate[]>;
        game['info'].differences = expectedDifference;
        game['differenceFound'] = expectedDifferenceFound;
        expect(game.isAllDifferenceFound()).to.equal(false);

        expectedDifference = { length: 10 } as Coordinate[][];
        expectedDifferenceFound = { size: 10 } as Set<Coordinate[]>;
        game['info'].differences = expectedDifference;
        game['differenceFound'] = expectedDifferenceFound;
        expect(game.isAllDifferenceFound()).to.equal(true);
    });

    it('should add a difference founded', () => {
        const isAlreadyDifferenceFoundSpy = stub(game, 'isDifferenceAlreadyFound').callsFake(() => true);
        const isAllDifferenceFoundSpy = stub(game, 'isAllDifferenceFound').callsFake(() => false);
        const isGameOverSpy = stub(game, 'isGameOver').callsFake(() => true);
        const differenceFoundSpy = stub(game['differenceFound'], 'add');
        game.differenceFounded([{} as Coordinate]);
        expect(isAlreadyDifferenceFoundSpy.called).to.equal(true);
        expect(isAllDifferenceFoundSpy.called).to.equal(false);
        expect(isGameOverSpy.called).to.equal(false);
        expect(differenceFoundSpy.called).to.equal(false);

        isAlreadyDifferenceFoundSpy.callsFake(() => false);
        const expectedCoordinates = [{ x: 0, y: 0 }];
        game.differenceFounded(expectedCoordinates);
        expect(isAlreadyDifferenceFoundSpy.calledTwice).to.equal(true);
        expect(isAllDifferenceFoundSpy.called).to.equal(true);
        expect(isGameOverSpy.called).to.equal(false);
        expect(differenceFoundSpy.called).to.equal(true);

        isAlreadyDifferenceFoundSpy.callsFake(() => false);
        isAllDifferenceFoundSpy.callsFake(() => true);
        const nextStateSpy = spy(game['context'], 'next');
        isGameOverSpy.callsFake(() => false);
        game.differenceFounded([{} as Coordinate]);
        expect(differenceFoundSpy.called).to.equal(true);
        expect(nextStateSpy.called).to.equal(true);
    });

    it('should verify if the difference is already found', () => {
        const differenceFoundSpy = stub(game['differenceFound'], 'has').callsFake(() => false);
        expect(game.isDifferenceAlreadyFound([{} as Coordinate])).to.equal(false);
        differenceFoundSpy.callsFake(() => true);
        expect(game.isDifferenceAlreadyFound([{} as Coordinate])).to.equal(true);
    });

    it('should return undefined if differences is not found with coordinate', () => {
        const expectedDifferences = [[{} as Coordinate]];
        game['info'] = { differences: expectedDifferences } as GameInfo;
        expect(game.findDifference({ x: 0, y: 0 })).to.equal(undefined);
    });

    it('should find a difference and return it', () => {
        const expectedDifferencesFound = [
            { x: 0, y: 0 },
            { x: 1, y: -1 },
        ];
        const expectedDifferences = [expectedDifferencesFound];
        game['info'] = { differences: expectedDifferences } as GameInfo;
        expect(game.findDifference({ x: 0, y: 0 })).to.deep.equal(expectedDifferencesFound);
    });

});
