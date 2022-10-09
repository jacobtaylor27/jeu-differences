import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CREATE_GAME, CREATE_GAME_ROOM, VALIDATE_COORD, VALID_GAME } from '@app/constants/server';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameInfo } from '@common/game-info';
import { GameMode } from '@common/game-mode';
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
        // eslint-disable-next-line dot-notation -- baseUrl is private and we need access for the test
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

    it('should get games info when select or admin page is loaded', () => {
        service.getAllGameInfos().subscribe({
            next: (response: HttpResponse<{ games: GameInfo[] }>) => {
                expect(response.body).toEqual({ games: [] });
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/game/cards`);
        expect(req.request.method).toBe('GET');
    });

    it('should not return any message when sending a POST request (HttpClient called once)', () => {
        const sentMessage: Message = { body: 'Hello', title: 'World' };
        // subscribe to the mocked call
        service.basicPost(sentMessage).subscribe({
            // eslint-disable-next-line @typescript-eslint/no-empty-function
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
                // eslint-disable-next-line @typescript-eslint/no-empty-function
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
                // eslint-disable-next-line @typescript-eslint/no-empty-function
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
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                next: () => {},
                error: fail,
            });
        const req = httpMock.expectOne(CREATE_GAME);
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
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                next: () => {},
                error: fail,
            });
        const req = httpMock.expectOne(CREATE_GAME);
        expect(req.request.method).toBe('POST');
        req.error(new ProgressEvent('Random error occurred'));
    });

    it('should send a request to create a game room', () => {
        service.createGameRoom('playername', GameMode.Classic, 'gameid').subscribe({
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            next: () => {},
            error: fail,
        });
        const req = httpMock.expectOne(CREATE_GAME_ROOM + '/gameid');
        expect(req.request.method).toBe('POST');
    });

    it('should handle http error when create a game room', () => {
        service.createGameRoom('playername', GameMode.Classic, 'gameid').subscribe({
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            next: () => {},
            error: fail,
        });
        const req = httpMock.expectOne(CREATE_GAME_ROOM + '/gameid');
        expect(req.request.method).toBe('POST');
        req.error(new ProgressEvent('Random error occurred'));
    });

    it('should send a request to validate coordinates', () => {
        service.validateCoordinates('gameid', { x: 0, y: 0 }).subscribe({
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            next: () => {},
            error: fail,
        });
        const req = httpMock.expectOne(VALIDATE_COORD);
        expect(req.request.method).toBe('POST');
        req.flush({ x: 0, y: 0, id: '' });
    });

    it('should handle http error when validate coord', () => {
        service.validateCoordinates('gameid', { x: 0, y: 0 }).subscribe({
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            next: () => {},
            error: fail,
        });
        const req = httpMock.expectOne(VALIDATE_COORD);
        expect(req.request.method).toBe('POST');
        req.error(new ProgressEvent('Random error occurred'));
    });

    // it('should return expected message (timer) when game page is loaded', () => {
    //     const expectedMessage: Message = { body: 'TimerAdmin', title: '120' };
    //     service.getTimeValue().subscribe({
    //         next: (response: Message) => {
    //             expect(response.title).toEqual(expectedMessage.title);
    //             expect(response.body).toEqual(expectedMessage.body);
    //         },
    //         error: fail,
    //     });

    //     const req = httpMock.expectOne(`${baseUrl}/game`);
    //     expect(req.request.method).toBe('GET');
    //     req.flush(expectedMessage);
    // });
});
