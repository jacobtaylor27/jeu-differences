import { Game } from '@app/classes/game/game';
import { PrivateGameInformation } from '@app/interface/game-info';
import { expect } from 'chai';
import { Container } from 'typedi';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { MultiplayerGameManager } from './multiplayer-game-manager.service';
import { User } from '@common/user';

const GAME = new Game('', { player: {} as User, isMulti: true }, { id: '1' } as PrivateGameInformation);
const GAME_FALSE = new Game('', { player: {} as User, isMulti: false }, { id: '2' } as PrivateGameInformation);

describe('Multiplayer Game Manager', () => {
    let multiplayerGameManager: MultiplayerGameManager;
    let spyGameManager: GameManagerService;

    beforeEach(() => {
        multiplayerGameManager = Container.get(MultiplayerGameManager);
        spyGameManager = Container.get(GameManagerService);
    });

    it('should be true if theres only one request', () => {
        expect(multiplayerGameManager.theresOneRequest('')).to.equal(false);
        multiplayerGameManager.addNewRequest('room', { name: 'name', id: '1' });
        expect(multiplayerGameManager.theresOneRequest('room')).to.equal(true);
    });

    it('should be true if theres no request', () => {
        multiplayerGameManager.requestsOnHold = new Map();
        expect(multiplayerGameManager.theresARequest('room')).to.equal(false);
        multiplayerGameManager.requestsOnHold.set('room', [{ name: 'name', id: '1' }]);
        expect(multiplayerGameManager.theresARequest('')).to.equal(false);
        expect(multiplayerGameManager.theresARequest('room')).to.equal(true);
    });

    it('should return true if its not a current players request', () => {
        expect(multiplayerGameManager.isNotAPlayersRequest('1', '1')).to.equal(false);
        expect(multiplayerGameManager.isNotAPlayersRequest('1', '2')).to.equal(true);
    });

    it('should add new Request', () => {
        multiplayerGameManager.requestsOnHold = new Map();
        multiplayerGameManager.addNewRequest('room', { name: 'name', id: '1' });
        expect(multiplayerGameManager.requestsOnHold.get('room')?.length).equal(1);

        multiplayerGameManager.addNewRequest('room', { name: 'name2', id: '2' });
        expect(multiplayerGameManager.requestsOnHold.get('room')?.length).equal(2);
    });

    it('should delete first request', () => {
        multiplayerGameManager.requestsOnHold = new Map();

        multiplayerGameManager.addNewRequest('room', { name: 'name', id: '1' });
        multiplayerGameManager.addNewRequest('room', { name: 'name2', id: '2' });
        multiplayerGameManager.deleteFirstRequest('room');

        expect(multiplayerGameManager.requestsOnHold.get('room')?.length).to.equal(1);
        multiplayerGameManager.deleteFirstRequest('room');
        expect(multiplayerGameManager.requestsOnHold.get('room')?.length).to.equal(0);

        multiplayerGameManager.requestsOnHold = new Map();
        expect(multiplayerGameManager.deleteFirstRequest('room') === undefined).to.equal(true);
    });

    it('should get the oldest request', () => {
        multiplayerGameManager.requestsOnHold = new Map();
        multiplayerGameManager.addNewRequest('room', { name: 'name', id: '1' });
        multiplayerGameManager.addNewRequest('room', { name: 'name2', id: '2' });

        const result = multiplayerGameManager.getNewRequest('room');
        expect(result.name).to.equal('name');
        expect(result.id).to.equal('1');
    });

    it('should add a game id', () => {
        multiplayerGameManager.addGameWaiting({ gameId: '1', roomId: '1' });
        expect(multiplayerGameManager.getGamesWaiting()).to.have.lengthOf(1);
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
        multiplayerGameManager['gamesWaiting'] = [{ gameId: '1', roomId: '1' }];
        expect(multiplayerGameManager.isGameWaiting('1')).to.equal(true);
        expect(multiplayerGameManager.isGameWaiting('3')).to.equal(false);
    });

    it('should get Room Id', () => {
        spyGameManager['games'] = new Set([]);
        multiplayerGameManager.setGamesWaiting();
        expect(multiplayerGameManager.getRoomIdWaiting('1')).to.equal('');
        spyGameManager['games'] = new Set([GAME]);
        multiplayerGameManager.setGamesWaiting();
        const [first] = spyGameManager['games'].values();
        expect(multiplayerGameManager.getRoomIdWaiting('1')).to.equal(first.identifier);
        expect(multiplayerGameManager.getRoomIdWaiting('3')).to.equal('');
    });
});
