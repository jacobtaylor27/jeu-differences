import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GameMode } from '@common/game-mode';
import { PublicGameInformation } from '@common/game-information';

@Injectable({
    providedIn: 'root',
})
export class GameInformationHandlerService {
    playerName: string;
    gameInformation: PublicGameInformation;
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

    getNbDifferences():number{
        return this.gameInformation.nbDifferences;
    }

    setGameInformation(gameInformation: PublicGameInformation): void {
        this.gameInformation = gameInformation;
    }

    setGameMode(gameMode: GameMode): void {
        this.gameMode = gameMode;
    }

    getGameMode(): GameMode {
        this.handleNotDefined();
        return this.gameMode;
    }

    getGameInformation(): PublicGameInformation {
        this.handleNotDefined();
        return this.gameInformation;
    }

    getId(): string {
        this.handleNotDefined();
        return this.gameInformation.id;
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
