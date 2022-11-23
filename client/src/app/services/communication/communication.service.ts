import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarouselResponse } from '@app/interfaces/carousel-response';
import { Vec2 } from '@app/interfaces/vec2';
import { Coordinate } from '@common/coordinate';
import { PublicGameInformation } from '@common/game-information';
import { GameMode } from '@common/game-mode';
import { Message } from '@common/message';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GameTimeConstants } from '@common/game-time-constants';
import { Score } from '@common/score';

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {
    private readonly baseUrl: string = environment.serverUrl;

    constructor(private readonly http: HttpClient) {}

    basicGet(): Observable<Message> {
        return this.http.get<Message>(`${this.baseUrl}/example`).pipe(catchError(this.handleError<Message>('basicGet')));
    }

    basicPost(message: Message): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/example/send`, message).pipe(catchError(this.handleError<void>('basicPost')));
    }

    deleteAllGameCards(): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/game/cards`).pipe(catchError(this.handleError<void>('deleteAllGameCards')));
    }

    deleteGame(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/game/cards/${id}`).pipe(catchError(this.handleError<void>('deleteGame')));
    }

    validateGame(original: ImageData, modify: ImageData, radius: number) {
        return this.http
            .post<{ numberDifference: number; width: number; height: number; data: number[] }>(
                `${this.baseUrl}/game/card/validation`,
                {
                    original: { width: original.width, height: original.height, data: Array.from(original.data) },
                    modify: { width: modify.width, height: modify.height, data: Array.from(modify.data) },
                    differenceRadius: radius,
                },
                { observe: 'response' },
            )
            .pipe(
                catchError(() => {
                    return of(null);
                }),
            );
    }

    createGame(image: { original: ImageData; modify: ImageData }, radius: number, name: string) {
        return this.http
            .post<Record<string, never>>(
                `${this.baseUrl}/game/card`,
                {
                    original: { width: image.original.width, height: image.original.height, data: Array.from(image.original.data) },
                    modify: { width: image.modify.width, height: image.modify.height, data: Array.from(image.modify.data) },
                    differenceRadius: radius,
                    name,
                },
                { observe: 'response' },
            )
            .pipe(
                catchError(() => {
                    return of(null);
                }),
            );
    }

    createGameRoom(playerName: string, gameMode: GameMode) {
        return this.http.post<{ id: string }>(`${this.baseUrl}/game/create`, { players: [playerName], mode: gameMode }, { observe: 'response' }).pipe(
            catchError(() => {
                return of(null);
            }),
        );
    }

    validateCoordinates(id: string, coordinate: Vec2) {
        return this.http
            .post<{ difference: Coordinate[]; isGameOver: boolean; differencesLeft: number }>(
                `${this.baseUrl}/game/difference`,
                {
                    x: coordinate.x,
                    y: coordinate.y,
                    id,
                },
                { observe: 'response' },
            )
            .pipe(
                catchError(() => {
                    return of(null);
                }),
            );
    }

    getImgData(id: string): Observable<HttpResponse<{ width: number; height: number; data: number[] }>> {
        return this.http.get<{ width: number; height: number; data: number[] }>(`${this.baseUrl}/bmp/${id}`, { observe: 'response' }).pipe();
    }

    getAllGameInfos(): Observable<HttpResponse<{ games: PublicGameInformation[] }>> {
        return this.http.get<{ games: PublicGameInformation[] }>(`${this.baseUrl}/game/cards`, { observe: 'response' }).pipe();
    }

    getGamesInfoByPage(page: number = 1): Observable<HttpResponse<CarouselResponse>> {
        return this.http.get<CarouselResponse>(`${this.baseUrl}/game/cards/?page=${page}`, { observe: 'response' }).pipe();
    }

    getGameTimeConstants(): Observable<HttpResponse<GameTimeConstants>> {
        return this.http
            .get<GameTimeConstants>(`${this.baseUrl}/game/constants`, { observe: 'response' })
            .pipe(catchError(this.handleError<HttpResponse<GameTimeConstants>>('get time constants')));
    }

    setGameTimeConstants(gameTimeConstants: GameTimeConstants): Observable<void> {
        return this.http
            .patch<void>(`${this.baseUrl}/game/constants`, gameTimeConstants)
            .pipe(catchError(this.handleError<void>('set time constants')));
    }

    refreshAllGames(): Observable<void> {
        return this.http.patch<void>(`${this.baseUrl}/game/scores/reset`, {}).pipe(catchError(this.handleError<void>('refreshAllGames')));
    }

    refreshSingleGame(id: string): Observable<void> {
        return this.http.patch<void>(`${this.baseUrl}/game/scores/${id}/reset`, {}).pipe(catchError(this.handleError<void>('refreshSingleGame')));
    }

    getGameScores(id: string): Observable<HttpResponse<{ solo: Score[]; multi: Score[] }>> {
        return this.http.get<{ solo: Score[]; multi: Score[] }>(`${this.baseUrl}/game/scores/${id}`, { observe: 'response' }).pipe();
    }

    updateGameScores(id: string, soloScores: Score[], multiScores: Score[]): Observable<void> {
        return this.http
            .patch<void>(`${this.baseUrl}/game/scores/${id}`, { soloScores, multiScores })
            .pipe(catchError(this.handleError<void>('updateGameScores')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }
}
