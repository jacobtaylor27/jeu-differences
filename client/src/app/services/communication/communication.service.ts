import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CREATE_GAME, VALID_GAME } from '@app/constants/server';
import { GameInfo } from '@common/game-info';
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

    getTimeValue(): Observable<Message> {
        return this.http.get<Message>(`${this.baseUrl}/game`).pipe(catchError(this.handleError<Message>('getTimeValue')));
    }

    basicPost(message: Message): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/example/send`, message).pipe(catchError(this.handleError<void>('basicPost')));
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
        return this.http.post<Record<string, never>>(
            CREATE_GAME,
            {
                original: { width: image.original.width, height: image.original.height, data: Array.from(image.original.data) },
                modify: { width: image.modify.width, height: image.modify.height, data: Array.from(image.modify.data) },
                differenceRadius: radius,
                name,
            },
            { observe: 'response' },
        );
    }

    getImgData(id: string): Observable<HttpResponse<{ width: number; height: number; data: number[] }>> {
        return this.http.get<{ width: number; height: number; data: number[] }>(`${this.baseUrl}/bmp/${id}`, { observe: 'response' }).pipe();
    }

    getAllGameInfos(): Observable<HttpResponse<{ games: GameInfo[] }>> {
        return this.http.get<{ games: GameInfo[] }>(`${this.baseUrl}/game/cards`, { observe: 'response' }).pipe();
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }
}