import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { GameMode } from '@common/game-mode';
import { SocketEvent } from '@common/socket-event';
import { Socket } from 'socket.io-client';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from './game-information-handler.service';

/* eslint-disable @typescript-eslint/no-empty-function */
class SocketClientServiceMock extends CommunicationSocketService {
    override connect() {}
}

describe('GameInformationHandlerService', () => {
    let service: GameInformationHandlerService;
    let router: Router;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;

    beforeEach(() => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;

        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [{ provide: CommunicationSocketService, useValue: socketServiceMock }],
        });

        service = TestBed.inject(GameInformationHandlerService);
        router = TestBed.inject(Router);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return false when properties are not Undefined', () => {
        service.playerName = 'test';
        service.gameInformation = {
            id: '1',
            name: 'test',
            thumbnail: 'image',
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            soloScore: [],
            multiplayerScore: [],
            nbDifferences: 0,
        };
        service.gameMode = GameMode.Classic;

        expect(service.propertiesAreUndefined()).toBeFalsy();
    });

    it('should handle socket', () => {
        spyOn(router, 'navigate');
        socketHelper.peerSideEmit(SocketEvent.Play, 'id');
        expect(service.gameId).toBe('id');

        socketHelper.peerSideEmit(SocketEvent.WaitPlayer, 'id');
        expect(service.gameId).toBe('id');
    });

    it('should return false when properties are not Undefined', () => {
        expect(service.propertiesAreUndefined()).toBeTruthy();
    });

    it('should return to homepage if properties are undefined', () => {
        const spyRouter = spyOn(router, 'navigate');
        service.handleNotDefined();
        expect(spyRouter).toHaveBeenCalledWith(['/']);
    });

    it('should set PlayerName', () => {
        const expectedName = 'test';
        service.setPlayerName(expectedName);
        expect(service.playerName).toEqual(expectedName);
    });

    it('should return nb of differences', () => {
        service.gameInformation = {
            id: '1',
            name: 'test',
            thumbnail: 'image',
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            soloScore: [],
            multiplayerScore: [],
            nbDifferences: 10,
        };
        expect(service.getNbDifferences()).toEqual(service.gameInformation.nbDifferences);
    });

    it('should return id', () => {
        service.gameInformation = {
            id: '1',
            name: 'test',
            thumbnail: 'image',
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            soloScore: [],
            multiplayerScore: [],
            nbDifferences: 0,
        };
        expect(service.getId()).toEqual(service.gameInformation.id);
    });

    it('should return original bmp id', () => {
        service.gameInformation = {
            id: '1',
            name: 'test',
            thumbnail: 'image',
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            soloScore: [],
            multiplayerScore: [],
            nbDifferences: 0,
        };
        expect(service.getOriginalBmpId()).toEqual('original');
    });

    it('should return modified bmp id', () => {
        service.gameInformation = {
            id: '1',
            name: 'test',
            thumbnail: 'image',
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            soloScore: [],
            multiplayerScore: [],
            nbDifferences: 0,
        };
        expect(service.getModifiedBmpId()).toEqual('edited');
    });

    it('should set game information', () => {
        const gameInformation = {
            id: '1',
            name: 'test',
            thumbnail: 'image',
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            idDifferenceBmp: 'difference',
            soloScore: [],
            multiplayerScore: [],
            differenceRadius: 2,
            differences: [],
            nbDifferences: 0,
        };
        service.setGameInformation(gameInformation);
        expect(service.gameInformation).toEqual(gameInformation);
    });

    it('should set game mode', () => {
        service.setGameMode(GameMode.Classic);
        expect(service.gameMode).toEqual(GameMode.Classic);
    });

    it('should get game mode', () => {
        service.gameMode = GameMode.Classic;
        expect(service.getGameMode()).toEqual(GameMode.Classic);
    });

    it('should get game name', () => {
        service.gameInformation = {
            id: '1',
            name: 'test',
            thumbnail: 'image',
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            soloScore: [],
            multiplayerScore: [],
            nbDifferences: 0,
        };
        expect(service.getGameName()).toEqual('test');
    });

    it('should get game information', () => {
        const gameInformation = {
            id: '1',
            name: 'test',
            thumbnail: 'image',
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            idDifferenceBmp: 'difference',
            soloScore: [],
            multiplayerScore: [],
            differenceRadius: 2,
            differences: [],
            nbDifferences: 0,
        };
        service.gameInformation = gameInformation;
        expect(service.getGameInformation()).toEqual(gameInformation);
    });

    it('should get player name', () => {
        service.playerName = 'test';
        expect(service.getPlayerName()).toEqual('test');
    });
});
