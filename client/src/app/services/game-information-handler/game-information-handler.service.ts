import { Injectable } from '@angular/core';
import { GameMode } from '@common/game-mode';
import { Router } from '@angular/router';
import { GameInformation } from '@app/interfaces/game-information';

@Injectable({
    providedIn: 'root',
})
export class GameInformationHandlerService {
    playerName: string;
    gameInformation: GameInformation;
    gameMode: GameMode = GameMode.Classic;

    constructor(private readonly router: Router) {}

    propertiesAreUndefined(): boolean {
        return this.gameInformation === undefined || this.playerName === undefined || this.gameMode === undefined;
    }

    handleNotDefined(): void {
        if (this.propertiesAreUndefined()) {
            this.router.navigate(['/']);
        }
    }

    setPlayerName(name: string): void {
        this.playerName = name;
    }

    getOriginalBmpId(): string {
        return this.gameInformation.idOriginalBmp;
    }

    getModifiedBmpId(): string {
        return this.gameInformation.idEditedBmp;
    }

    setGameInformation(gameInformation: GameInformation): void {
        this.gameInformation = gameInformation;
    }

    setGameMode(gameMode: GameMode): void {
        this.gameMode = gameMode;
    }

    getGameMode(): GameMode {
        this.handleNotDefined();
        return this.gameMode;
    }

    getGameInformation(): GameInformation {
        this.handleNotDefined();
        return this.gameInformation;
    }

    getGameName(): string {
        this.handleNotDefined();
        return this.gameInformation.name;
    }

    getPlayerName(): string {
        this.handleNotDefined();
        return this.playerName;
    }
}
