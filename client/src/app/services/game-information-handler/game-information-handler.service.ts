import { Injectable } from '@angular/core';
import { GameInfo } from '@common/game-info';
import { GameMode } from '@common/game-mode';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class GameInformationHandlerService {
    playerName: string;
    gameInformation: GameInfo;
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

    setGameInformation(gameInformation: GameInfo): void {
        this.gameInformation = gameInformation;
    }

    setGameMode(gameMode: GameMode): void {
        this.gameMode = gameMode;
    }

    getGameMode(): GameMode {
        this.handleNotDefined();
        return this.gameMode;
    }

    getGameInformation(): GameInfo {
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
