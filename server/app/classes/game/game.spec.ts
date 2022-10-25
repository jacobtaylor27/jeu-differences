import { EndGameState } from '@app/classes/end-game-state/end-game-state';
import { FindDifferenceState } from '@app/classes/find-difference-state/find-difference-state';
import { Game } from '@app/classes/game/game';
import { InitGameState } from '@app/classes/init-game-state/init-game-state';
import { GameMode } from '@app/enum/game-mode';
import { GameStatus } from '@app/enum/game-status';
import { PrivateGameInformation } from '@app/interface/game-info';
import { User } from '@app/interface/user';
import { Coordinate } from '@common/coordinate';
import { Score } from '@common/score';
import { expect } from 'chai';
import { spy, stub } from 'sinon';

describe('Game', () => {
    let game: Game;
    const expectedGameInfo: PrivateGameInformation = {
        id: '1',
        idOriginalBmp: '0',
        thumbnail: 'thumbnail',
        idEditedBmp: '1',
        idDifferenceBmp: '2',
        soloScore: [{} as Score],
        multiplayerScore: [{} as Score],
        name: 'test game',
        differenceRadius: 0,
        differences: [[{} as Coordinate]],
    };
    const expectedPlayer = { player: { name: 'test player', id: 'test' }, isMulti: false };
    const expectedMode = 'classic';
    beforeEach(() => {
        game = new Game(expectedMode, expectedPlayer, expectedGameInfo);
    });

    it('should create a game with specific mode, players and game information', () => {
        const expectedGameState = new FindDifferenceState();
        const newGame = new Game(expectedMode, expectedPlayer, expectedGameInfo);
        expect(newGame.information).to.deep.equal(expectedGameInfo);
        expect(newGame['players'].has(expectedPlayer.player.id)).to.equal(true);
        expect(newGame['isMulti']).to.deep.equal(expectedPlayer.isMulti);
        expect(newGame['getNbDifferencesFound']).to.deep.equal(new Set<Coordinate[]>());
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
        game['getNbDifferencesFound'] = expectedDifferenceFound;
        expect(game.nbDifferencesLeft()).to.equal(expectedDifference.length - expectedDifferenceFound.size);
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
        game['getNbDifferencesFound'] = expectedDifferenceFound;
        expect(game.isAllDifferenceFound()).to.equal(false);

        expectedDifference = { length: 10 } as Coordinate[][];
        expectedDifferenceFound = { size: 10 } as Set<Coordinate[]>;
        game['info'].differences = expectedDifference;
        game['getNbDifferencesFound'] = expectedDifferenceFound;
        expect(game.isAllDifferenceFound()).to.equal(true);
    });

    it('should add a difference founded', () => {
        const isAlreadyDifferenceFoundSpy = stub(game, 'isDifferenceAlreadyFound').callsFake(() => true);
        const isAllDifferenceFoundSpy = stub(game, 'isAllDifferenceFound').callsFake(() => false);
        const isGameOverSpy = stub(game, 'isGameOver').callsFake(() => true);
        const getNbDifferencesFoundSpy = stub(game['getNbDifferencesFound'], 'add');
        game.addCoordinatesOnDifferenceFound([{} as Coordinate]);
        expect(isAlreadyDifferenceFoundSpy.called).to.equal(true);
        expect(isAllDifferenceFoundSpy.called).to.equal(false);
        expect(isGameOverSpy.called).to.equal(false);
        expect(getNbDifferencesFoundSpy.called).to.equal(false);

        isAlreadyDifferenceFoundSpy.callsFake(() => false);
        const expectedCoordinates = [{ x: 0, y: 0 }];
        game.addCoordinatesOnDifferenceFound(expectedCoordinates);
        expect(isAlreadyDifferenceFoundSpy.calledTwice).to.equal(true);
        expect(isAllDifferenceFoundSpy.called).to.equal(true);
        expect(isGameOverSpy.called).to.equal(false);
        expect(getNbDifferencesFoundSpy.called).to.equal(true);

        isAlreadyDifferenceFoundSpy.callsFake(() => false);
        isAllDifferenceFoundSpy.callsFake(() => true);
        const nextStateSpy = spy(game['context'], 'next');
        isGameOverSpy.callsFake(() => false);
        game.addCoordinatesOnDifferenceFound([{} as Coordinate]);
        expect(getNbDifferencesFoundSpy.called).to.equal(true);
        expect(nextStateSpy.called).to.equal(true);
    });

    it('should verify if the difference is already found', () => {
        const getNbDifferencesFoundSpy = stub(game['getNbDifferencesFound'], 'has').callsFake(() => false);
        expect(game.isDifferenceAlreadyFound([{} as Coordinate])).to.equal(false);
        getNbDifferencesFoundSpy.callsFake(() => true);
        expect(game.isDifferenceAlreadyFound([{} as Coordinate])).to.equal(true);
    });

    it('should return undefined if differences is not found with coordinate', () => {
        const expectedDifferences = [[{} as Coordinate]];
        game['info'] = { differences: expectedDifferences } as PrivateGameInformation;
        expect(game.findDifference({ x: 0, y: 0 })).to.equal(undefined);
    });

    it('should find a difference and return it', () => {
        const expectedDifferencesFound = [
            { x: 0, y: 0 },
            { x: 1, y: -1 },
        ];
        const expectedDifferences = [expectedDifferencesFound];
        game['info'] = { differences: expectedDifferences } as PrivateGameInformation;
        expect(game.findDifference({ x: 0, y: 0 })).to.deep.equal(expectedDifferencesFound);
    });

    it('should return null if no difference is found or already found', () => {
        const findDifferenceSpy = stub(game, 'findDifference').callsFake(() => undefined);
        expect(game.isDifferenceFound({} as Coordinate)).to.equal(null);
        expect(findDifferenceSpy.called).to.equal(true);
        const expectedDifferences = [] as Coordinate[];
        findDifferenceSpy.callsFake(() => expectedDifferences);
        const isDifferenceAlreadyFoundSpy = stub(game, 'isDifferenceAlreadyFound').callsFake(() => true);
        expect(game.isDifferenceFound({} as Coordinate)).to.equal(null);
        expect(isDifferenceAlreadyFoundSpy.called).to.equal(true);
        isDifferenceAlreadyFoundSpy.callsFake(() => false);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const addCoordinatesOnDifferenceFoundSpy = stub(game, 'addCoordinatesOnDifferenceFound').callsFake(() => {});
        expect(game.isDifferenceFound({} as Coordinate)).to.equal(expectedDifferences);
        expect(addCoordinatesOnDifferenceFoundSpy.called).to.equal(true);
    });

    it('should get if the game is in multi or not', () => {
        expect(game.multi).to.equal(false);
        game['isMulti'] = true;
        expect(game.multi).to.equal(true);
    });

    it('should verify if the game is full', () => {
        const expectedFistPlayer = { name: 'test1', id: '1' };
        expect(game.isGameFull()).to.equal(true);
        game.players.delete(expectedPlayer.player.id);
        expect(game.isGameFull()).to.equal(false);
        game['isMulti'] = true;
        expect(game.isGameFull()).to.equal(false);
        game.players.set(expectedPlayer.player.id, expectedPlayer.player.name);
        game.players.set(expectedFistPlayer.id, expectedFistPlayer.name);
        expect(game.isGameFull()).to.equal(true);
    });

    it('should not add a player if the game is full', () => {
        const expectedPlayer1 = {} as User;
        const spyIsGameFull = stub(game, 'isGameFull').callsFake(() => true);
        game.addPlayer(expectedPlayer1);
        expect(game.players.has(expectedPlayer1.id)).to.equal(false);
        game['isMulti'] = true;
        game.addPlayer(expectedPlayer1);
        expect(game.players.has(expectedPlayer1.id)).to.equal(false);
        spyIsGameFull.callsFake(() => true);
        game.addPlayer(expectedPlayer1);
        expect(game.players.has(expectedPlayer1.id)).to.equal(false);
    });

    it('should add a player in a game if the game is not full', () => {
        stub(game, 'isGameFull').callsFake(() => false);
        const expectedPlayer1 = { name: 'test', id: '' };
        game['isMulti'] = true;
        game.addPlayer(expectedPlayer1);
        expect(game.players.has(expectedPlayer1.id)).to.equal(true);
    });

    it('should find a player', () => {
        const expectedPlayer1 = { name: 'test', id: '1' };
        expect(game.findPlayer(expectedPlayer1.id)).to.equal(undefined);
        expect(game.findPlayer(expectedPlayer.player.id)).to.equal(expectedPlayer.player.name);
    });

    it('should leave a game if the player is found', () => {
        const spyDeletePlayer = stub(game.players, 'delete');
        const expectedPlayer1 = { name: 'test', id: '1' };
        game.leaveGame(expectedPlayer1.id);
        expect(spyDeletePlayer.called).to.equal(false);
        game.leaveGame(expectedPlayer.player.id);
        // expect(game.players.has(expectedPlayer.player.id)).to.equal(false);
        const endGameState = new EndGameState();
        expect(game.status()).to.equal(endGameState.status());
    });

    it('should check if all player leave', () => {
        expect(game.hasNoPlayer()).to.equal(false);
        game.players = new Map();
        expect(game.hasNoPlayer()).to.equal(true);
    });
});
