import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CREATE_GAME, CREATE_GAME_ROOM, VALIDATE_COORD, VALID_GAME } from '@app/constants/server';
import { Vec2 } from '@app/interfaces/vec2';
import { Coordinate } from '@common/coordinate';
import { PublicGameInformation } from '@common/game-information';
import { GameMode } from '@common/game-mode';
import { Message } from '@common/message';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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

    deleteAllGameCards(): void {
        this.http
            .delete(`${this.baseUrl}/game/cards`)
            .pipe(catchError(this.handleError('deleteAllGameCards')))
            .subscribe();
    }

    validateGame(original: ImageData, modify: ImageData, radius: number) {
        return this.http
            .post<{ numberDifference: number; width: number; height: number; data: number[] }>(
                VALID_GAME,
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
                CREATE_GAME,
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

    createGameRoom(playerName: string, gameMode: GameMode, gameId: string) {
        return this.http
            .post<{ id: string }>(`${CREATE_GAME_ROOM}/${gameId}`, { players: [playerName], mode: gameMode }, { observe: 'response' })
            .pipe(
                catchError(() => {
                    return of(null);
                }),
            );
    }

    validateCoordinates(id: string, coordinate: Vec2) {
        return this.http
            .post<{ difference: Coordinate[]; isGameOver: boolean; differencesLeft: number }>(
                VALIDATE_COORD,
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

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }

    // getTimeValue(): Observable<Message> {
    //     return this.http.get<Message>(`${this.baseUrl}/game`).pipe(catchError(this.handleError<Message>('getTimeValue')));
    // }
}
