import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GameMode } from '@common/game-mode';
import { GameInformationHandlerService } from './game-information-handler.service';

describe('GameInformationHandlerService', () => {
    let service: GameInformationHandlerService;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
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
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            idDifferenceBmp: 'difference',
            soloScore: [],
            multiplayerScore: [],
            differenceRadius: 2,
            differences: [],
        };
        service.gameMode = GameMode.Classic;

        expect(service.propertiesAreUndefined()).toBeFalsy();
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

    it('should return original bmp id', () => {
        service.gameInformation = {
            id: '1',
            name: 'test',
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            idDifferenceBmp: 'difference',
            soloScore: [],
            multiplayerScore: [],
            differenceRadius: 2,
            differences: [],
        };
        expect(service.getOriginalBmpId()).toEqual('original');
    });

    it('should return modified bmp id', () => {
        service.gameInformation = {
            id: '1',
            name: 'test',
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            idDifferenceBmp: 'difference',
            soloScore: [],
            multiplayerScore: [],
            differenceRadius: 2,
            differences: [],
        };
        expect(service.getModifiedBmpId()).toEqual('edited');
    });

    it('should set game information', () => {
        const gameInformation = {
            id: '1',
            name: 'test',
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            idDifferenceBmp: 'difference',
            soloScore: [],
            multiplayerScore: [],
            differenceRadius: 2,
            differences: [],
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
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            idDifferenceBmp: 'difference',
            soloScore: [],
            multiplayerScore: [],
            differenceRadius: 2,
            differences: [],
        };
        expect(service.getGameName()).toEqual('test');
    });

    it('should get game information', () => {
        const gameInformation = {
            id: '1',
            name: 'test',
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            idDifferenceBmp: 'difference',
            soloScore: [],
            multiplayerScore: [],
            differenceRadius: 2,
            differences: [],
        };
        service.gameInformation = gameInformation;
        expect(service.getGameInformation()).toEqual(gameInformation);
    });

    it('should get player name', () => {
        service.playerName = 'test';
        expect(service.getPlayerName()).toEqual('test');
    });
});
