import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { PublicGameInformation } from '@common/game-information';
import { GameMode } from '@common/game-mode';
import { SocketEvent } from '@common/socket-event';

@Injectable({
    providedIn: 'root',
})
export class GameInformationHandlerService {
    playerName: string;
    gameId: string;
    gameInformation: PublicGameInformation;
    gameMode: GameMode = GameMode.Classic;

    constructor(private readonly router: Router, private readonly socket: CommunicationSocketService) {
        this.handleSocketEvent();
    }

    propertiesAreUndefined(): boolean {
        return this.gameInformation === undefined || this.playerName === undefined || this.gameMode === undefined;
    }

    handleSocketEvent() {
        this.socket.on(SocketEvent.Play, (gameId: string) => {
            this.gameId = gameId;
            this.router.navigate(['/game']);
        });

        this.socket.on(SocketEvent.WaitPlayer, (gameId: string) => {
            this.gameId = gameId;
            this.router.navigate(['/waiting']);
        });
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

    getNbDifferences(): number {
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
