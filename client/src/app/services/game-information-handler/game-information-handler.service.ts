import { Injectable } from '@angular/core';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { RouterService } from '@app/services/router-service/router.service';
import { PublicGameInformation } from '@common/game-information';
import { GameMode } from '@common/game-mode';
import { SocketEvent } from '@common/socket-event';
import { Subject } from 'rxjs';
import { GameId } from '@common/game-id';

@Injectable({
    providedIn: 'root',
})
export class GameInformationHandlerService {
    players: { name: string; nbDifferences: number }[] = [];
    roomId: string;
    $differenceFound: Subject<string> = new Subject();
    gameInformation: PublicGameInformation;
    gameMode: GameMode = GameMode.Classic;
    isReadyToAccept: boolean = true;
    isMulti: boolean = false;

    constructor(private readonly routerService: RouterService, private readonly socket: CommunicationSocketService) {}

    propertiesAreUndefined(): boolean {
        return this.gameInformation === undefined || this.players === undefined || this.gameMode === undefined;
    }

    handleSocketEvent() {
        if (!this.isMulti) {
            this.socket.once(SocketEvent.Play, (infos: GameId) => {
                if (infos.gameCard) {
                    this.setGameInformation(infos.gameCard);
                }
                this.roomId = infos.gameId;
                this.routerService.navigateTo('game');
            });
        }

        this.socket.on(SocketEvent.WaitPlayer, (roomId: string) => {
            this.roomId = roomId;
            this.isMulti = true;
            this.routerService.navigateTo('waiting');
        });
    }

    handleNotDefined(): void {
        if (this.propertiesAreUndefined()) {
            this.routerService.navigateTo('/');
        }
    }

    resetPlayers() {
        this.players = [];
    }

    setPlayerName(name: string): void {
        this.players.push({ name, nbDifferences: 0 });
    }

    getOriginalBmpId(): string {
        return this.gameInformation.idOriginalBmp;
    }

    getModifiedBmpId(): string {
        return this.gameInformation.idEditedBmp;
    }

    getNbDifferences(playerName: string) {
        return this.players.find((player) => player.name === playerName)?.nbDifferences;
    }

    getNbTotalDifferences(): number {
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

    getPlayer(): { name: string; nbDifferences: number } {
        this.handleNotDefined();
        return this.players[0];
    }

    getOpponent(): { name: string; nbDifferences: number } {
        return this.players[1];
    }
}
