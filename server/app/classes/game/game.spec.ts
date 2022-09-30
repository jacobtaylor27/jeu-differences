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
