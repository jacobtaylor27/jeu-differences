import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ExitButtonHandlerService {
    isOnGamePage: boolean;

    setCreateGamePage(): void {
        this.isOnGamePage = false;
    }

    setGamePage(): void {
        this.isOnGamePage = true;
    }

    getMessage(): string {
        return this.isOnGamePage ? 'Quitter la partie ?' : 'Quitter la création ?';
    }
}
