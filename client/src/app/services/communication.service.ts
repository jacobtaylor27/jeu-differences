import { HttpClient, HttpResponse } from '@angular/common/http';
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

    getImgData(id: string): Observable<HttpResponse<{ width: number; height: number; data: number[] }>> {
        return this.http.get<{ width: number; height: number; data: number[] }>(`${this.baseUrl}/bmp/${id}`, { observe: 'response' }).pipe();
    }

    basicPost(message: Message): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/example/send`, message).pipe(catchError(this.handleError<void>('basicPost')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }
}
