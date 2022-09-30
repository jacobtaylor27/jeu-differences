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

});
