import { Game } from '@app/classes/game/game';
import { PrivateGameInformation } from '@app/interface/game-info';
import { expect } from 'chai';
import { Container } from 'typedi';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { MultiplayerGameManager } from './multiplayer-game-manager.service';
import { User } from '@app/interface/user';

const GAME = new Game('', { player: {} as User, isMulti: true }, { id: '1' } as PrivateGameInformation);
const GAME_FALSE = new Game('', { player: {} as User, isMulti: false }, { id: '2' } as PrivateGameInformation);

describe('Multiplayer Game Manager', () => {
    let multiplayerGameManager: MultiplayerGameManager;
    let spyGameManager: GameManagerService;

    beforeEach(() => {
        multiplayerGameManager = Container.get(MultiplayerGameManager);
        spyGameManager = Container.get(GameManagerService);
    });

    it('should add a game id', () => {
        multiplayerGameManager.addGameWaiting('test');
        expect(multiplayerGameManager.getGamesWaiting()).to.have.lengthOf(1);
    });

    it('should verify if the game has space for a player', () => {
        expect(multiplayerGameManager.gameHasSpaceLeft(GAME).valueOf()).to.equal(true);
    });

    it('should set the games that are waiting for an opponent', () => {
        spyGameManager['games'] = new Set([GAME]);
        multiplayerGameManager.setGamesWaiting();
        expect(multiplayerGameManager['gamesWaiting'].length).to.equal(1);
    });

    it('should not set the games if is multi is false', () => {
        spyGameManager['games'] = new Set([GAME_FALSE]);
        multiplayerGameManager.setGamesWaiting();
        expect(multiplayerGameManager['gamesWaiting'].length).to.equal(0);
    });

    it('should return if a player is waiting in a room', () => {
        expect(multiplayerGameManager.isGameWaiting('')).to.equal(false);
        spyGameManager['games'] = new Set([GAME]);
        expect(multiplayerGameManager.isGameWaiting('1')).to.equal(true);
    });
});
