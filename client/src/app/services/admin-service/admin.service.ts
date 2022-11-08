import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameConstantsSettingsComponent } from '@app/components/game-constants-settings/game-constants-settings.component';
import { GameConstants } from '@app/interfaces/game-constants';
import { GameCardHandlerService } from '@app/services/game-card-handler/game-card-handler.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { SocketEvent } from '@common/socket-event';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    gameConstants: GameConstants;

    constructor(
        private readonly gameCardHandlerService: GameCardHandlerService,
        private readonly matDialog: MatDialog,
        private readonly communicationService: CommunicationService,
        private readonly socketService: CommunicationSocketService,
    ) {}

    hasGameCards(): boolean {
        return this.gameCardHandlerService.hasCards();
    }

    deleteAllGames(): void {
        for (const game of this.gameCardHandlerService.getGameCards()) {
            this.socketService.send(SocketEvent.GameDeleted, { gameId: game.gameInformation.id });
        }
        this.communicationService.deleteAllGameCards().subscribe();
    }

    openSettings(): void {
        this.matDialog.open(GameConstantsSettingsComponent);
    }

    resetAllHighScores(): void {
        this.gameCardHandlerService.resetAllHighScores();
    }
}
