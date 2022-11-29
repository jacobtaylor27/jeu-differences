import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CREATE_GAME, CREATE_GAME_ROOM, DELETE_GAMES, VALIDATE_COORD, VALID_GAME } from '@app/constants/server';
import { CarouselResponse } from '@app/interfaces/carousel-response';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameMode } from '@common/game-mode';
import { GameTimeConstants } from '@common/game-time-constants';
import { Message } from '@common/message';

describe('CommunicationService', () => {
    let httpMock: HttpTestingController;
    let service: CommunicationService;
    let baseUrl: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(CommunicationService);
        httpMock = TestBed.inject(HttpTestingController);
        baseUrl = service['baseUrl'];
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return expected message (HttpClient called once)', () => {
        const expectedMessage: Message = { body: 'Hello', title: 'World' };

        // check the content of the mocked call
        service.basicGet().subscribe({
            next: (response: Message) => {
                expect(response.title).toEqual(expectedMessage.title);
                expect(response.body).toEqual(expectedMessage.body);
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/example`);
        expect(req.request.method).toBe('GET');
        // actually send the request
        req.flush(expectedMessage);
    });

    it('should get image data when game card is loaded', () => {
        service.getImgData('original').subscribe({
            next: (response: HttpResponse<{ width: number; height: number; data: number[] }>) => {
                expect(response.body).toEqual({ width: 0, height: 0, data: [] });
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/bmp/original`);
        expect(req.request.method).toBe('GET');
    });

    it('should not return any message when sending a POST request (HttpClient called once)', () => {
        const sentMessage: Message = { body: 'Hello', title: 'World' };
        // subscribe to the mocked call
        service.basicPost(sentMessage).subscribe({
            // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake next and return {}
            next: () => {},
            error: fail,
        });
        const req = httpMock.expectOne(`${baseUrl}/example/send`);
        expect(req.request.method).toBe('POST');
        // actually send the request
        req.flush(sentMessage);
    });

    it('should handle http error safely', () => {
        service.basicGet().subscribe({
            next: (response: Message) => {
                expect(response).toBeUndefined();
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/example`);
        expect(req.request.method).toBe('GET');
        req.error(new ProgressEvent('Random error occurred'));
    });

    it('should send a request to validate a game', () => {
        service
            .validateGame(
                { width: 0, height: 0, data: new Uint8ClampedArray() } as ImageData,
                { width: 0, height: 0, data: new Uint8ClampedArray() } as ImageData,
                0,
            )
            .subscribe({
                // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake next and return {}
                next: () => {},
                error: fail,
            });
        const req = httpMock.expectOne(VALID_GAME);
        expect(req.request.method).toBe('POST');
        req.flush({
            original: { width: 0, height: 0, data: Array.from([]) },
            modify: { width: 0, height: 0, data: Array.from([]) },
            differenceRadius: 0,
        });
    });

    it('should handle http error when validate a game', () => {
        service
            .validateGame(
                { width: 0, height: 0, data: new Uint8ClampedArray() } as ImageData,
                { width: 0, height: 0, data: new Uint8ClampedArray() } as ImageData,
                0,
            )
            .subscribe({
                // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake next and return {}
                next: () => {},
                error: fail,
            });
        const req = httpMock.expectOne(VALID_GAME);
        expect(req.request.method).toBe('POST');
        req.error(new ProgressEvent('Random error occurred'));
    });

    it('should send a request to create a game', () => {
        service
            .createGame(
                {
                    original: { width: 0, height: 0, data: new Uint8ClampedArray() } as ImageData,
                    modify: { width: 0, height: 0, data: new Uint8ClampedArray() } as ImageData,
                },
                3,
                '',
            )
            .subscribe({
                // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake next and return {}
                next: () => {},
                error: fail,
            });
        const req = httpMock.expectOne(`${baseUrl}/game/card`);
        expect(req.request.method).toBe('POST');
        req.flush({
            original: { width: 0, height: 0, data: Array.from([]) },
            modify: { width: 0, height: 0, data: Array.from([]) },
            differenceRadius: 0,
            name: '',
        });
    });

    it('should handle http error when create a game', () => {
        service
            .createGame(
                {
                    original: { width: 0, height: 0, data: new Uint8ClampedArray() } as ImageData,
                    modify: { width: 0, height: 0, data: new Uint8ClampedArray() } as ImageData,
                },
                3,
                '',
            )
            .subscribe({
                // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake next and return {}
                next: (response) => {
                    expect(response).toBeNull();
                },
            });
        const req = httpMock.expectOne(CREATE_GAME);
        expect(req.request.method).toBe('POST');
        req.error(new ProgressEvent('Random error occurred'));
    });

    it('should send a request to create a game room', () => {
        service.createGameRoom('playername', GameMode.Classic).subscribe({
            // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake next and return {}
            next: () => {},
            error: fail,
        });
        const req = httpMock.expectOne(`${baseUrl}/game/create`);
        expect(req.request.method).toBe('POST');
    });

    it('should handle http error when create a game room', () => {
        service.createGameRoom('playername', GameMode.Classic).subscribe({
            next: (response) => {
                expect(response).toBeNull();
            },
        });
        const req = httpMock.expectOne(CREATE_GAME_ROOM);
        expect(req.request.method).toBe('POST');
        req.error(new ProgressEvent('Random error occurred'));
    });

    it('should send a request to validate coordinates', () => {
        service.validateCoordinates('gameid', { x: 0, y: 0 }).subscribe({
            // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake next and return {}
            next: () => {},
            error: fail,
        });
        const req = httpMock.expectOne(VALIDATE_COORD);
        expect(req.request.method).toBe('POST');
        req.flush({ x: 0, y: 0, id: '' });
    });

    it('should handle http error when validate coord', () => {
        service.validateCoordinates('gameid', { x: 0, y: 0 }).subscribe({
            next: (response) => {
                expect(response).toBeNull();
            },
            error: fail,
        });
        const req = httpMock.expectOne(VALIDATE_COORD);
        expect(req.request.method).toBe('POST');
        req.error(new ProgressEvent('Random error occurred'));
    });

    it('should handle delete all game cards', () => {
        service.deleteAllGameCards().subscribe({
            // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake next and return {}
            next: () => {},
            error: fail,
        });
        const req = httpMock.expectOne(DELETE_GAMES);
        expect(req.request.method).toBe('DELETE');
    });

    it('should delete a game by id', () => {
        service.deleteGame('gameid').subscribe({
            // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake next and return {}
            next: () => {},
            error: fail,
        });
        const req = httpMock.expectOne(DELETE_GAMES + '/gameid');
        expect(req.request.method).toBe('DELETE');
    });

    it('should get cards by page number', () => {
        service.getGamesInfoByPage().subscribe({
            next: (response: HttpResponse<CarouselResponse>) => {
                expect(response.body).toEqual({} as CarouselResponse);
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/game/cards/?page=1`);
        expect(req.request.method).toBe('GET');
    });

    it('should get the game time constants', () => {
        service.getGameTimeConstants().subscribe({
            next: (response: HttpResponse<GameTimeConstants>) => {
                expect(response.body).toEqual({} as GameTimeConstants);
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/game/constants`);
        expect(req.request.method).toBe('GET');
    });

    it('should set the game time constants', () => {
        service.setGameTimeConstants({} as GameTimeConstants).subscribe({
            next: (response: void) => {
                expect(response).toBeUndefined();
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/game/constants`);
        expect(req.request.method).toBe('PATCH');
    });

    it('should refresh all the scores for each game', () => {
        service.refreshAllGames().subscribe({
            next: (response: void) => {
                expect(response).toBeUndefined();
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/game/scores/reset`);
        expect(req.request.method).toBe('PATCH');
    });

    it('should reset the scores for a single game', () => {
        service.refreshSingleGame('1').subscribe({
            next: (response: void) => {
                expect(response).toBeUndefined();
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/game/scores/1/reset`);
        expect(req.request.method).toBe('PATCH');
    });
});
