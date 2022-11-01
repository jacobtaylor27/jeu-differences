import { expect } from 'chai';
import { Container } from 'typedi';
import { MultiplayerGameManager } from './multiplayer-game-manager.service';

describe.only('Multiplayer Game Manager', () => {
    let multiplayerGameManager: MultiplayerGameManager;

    beforeEach(() => {
        multiplayerGameManager = Container.get(MultiplayerGameManager);
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

    it('should delete all requests of a room', () => {
        multiplayerGameManager.requestsOnHold = new Map();
        multiplayerGameManager.addNewRequest('room', { name: 'name', id: '1' });
        multiplayerGameManager.addNewRequest('room', { name: 'name2', id: '2' });
        multiplayerGameManager.deleteAllRequests('room');
        expect(multiplayerGameManager.requestsOnHold.get('room')?.length).to.equal(undefined);
    });

    it('should add a game id', () => {
        multiplayerGameManager.addGameWaiting({ gameId: '1', roomId: '1' });
        expect(multiplayerGameManager.getGamesWaiting()).to.have.lengthOf(1);
    });

    it('should return if a player is waiting in a room', () => {
        expect(multiplayerGameManager.isGameWaiting('')).to.equal(false);
        multiplayerGameManager['gamesWaiting'] = [{ gameId: '1', roomId: '1' }];
        expect(multiplayerGameManager.isGameWaiting('1')).to.equal(true);
        expect(multiplayerGameManager.isGameWaiting('3')).to.equal(false);
    });

    it('should get Room Id', () => {
        multiplayerGameManager['gamesWaiting'] = [];
        multiplayerGameManager.addGameWaiting({gameId: '1', roomId: '1'});
        expect(multiplayerGameManager.getRoomIdWaiting('1')).to.equal('1');
        multiplayerGameManager['gamesWaiting'] = [];
        multiplayerGameManager.addGameWaiting({gameId: '2', roomId: '2'});
        const first = multiplayerGameManager['gamesWaiting'][0];
        expect(multiplayerGameManager.getRoomIdWaiting('2')).to.equal(first.roomId);
        expect(multiplayerGameManager.getRoomIdWaiting('3')).to.equal('');
    });
});
