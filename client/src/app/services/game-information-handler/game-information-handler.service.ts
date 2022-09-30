import { Injectable } from '@angular/core';
import { GameInformation } from '@app/interfaces/game-information';
import { GameMode } from '@common/game-mode';

@Injectable({
    providedIn: 'root',
})
export class GameInformationHandlerService {
    playerName: string;
    gameInformation: GameInformation;
    gameMode: GameMode = GameMode.Classic;

    setPlayerName(name: string): void {
        this.playerName = name;
    }

    setGameInformation(gameInformation: GameInformation): void {
        this.gameInformation = gameInformation;
    }

    setGameMode(gameMode: GameMode): void {
        this.gameMode = gameMode;
    }

    getGameMode(): GameMode {
        return this.gameMode;
    }

    getGameInformation(): GameInformation {
        return this.gameInformation;
    }

    getPlayerName(): string {
        return this.playerName;
    }
}
