import { Injectable } from '@angular/core';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { PublicGameInformation } from '@common/game-information';
import { GameMode } from '@common/game-mode';
import { SocketEvent } from '@common/socket-event';
import { RouterService } from '@app/services/router-service/router.service';
import { User } from '@common/user';

@Injectable({
    providedIn: 'root',
})
export class GameInformationHandlerService {
    playerName: string;
    roomId: string;
    gameInformation: PublicGameInformation;
    gameMode: GameMode = GameMode.Classic;
    isReadyToAccept : boolean = true;
    requestsNotTreated : User[] = [];

    constructor(private readonly routerService: RouterService, private readonly socket: CommunicationSocketService) {}

    propertiesAreUndefined(): boolean {
        return this.gameInformation === undefined || this.playerName === undefined || this.gameMode === undefined;
    }

    handleSocketEvent() {
        this.socket.on(SocketEvent.Play, (gameId: string) => {
            this.roomId = gameId;
            this.routerService.navigateTo('game');
        });

        this.socket.on(SocketEvent.WaitPlayer, (roomId: string) => {
            this.roomId = roomId;
            this.routerService.navigateTo('waiting');
        });
    }

    handleNotDefined(): void {
        if (this.propertiesAreUndefined()) {
            this.routerService.navigateTo('/');
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
