import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

    getImgData(id: string): Observable<void> {
        return this.http.get<void>(`${this.baseUrl}/bmp/${id}`).pipe(catchError(this.handleError<void>('getImgData')));
    }

    basicPost(message: Message): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/example/send`, message).pipe(catchError(this.handleError<void>('basicPost')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }
}
