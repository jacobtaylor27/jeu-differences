import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class GameInformationHandlerService {
    name: string;

    setName(name: string): void {
        this.name = name;
    }
}
