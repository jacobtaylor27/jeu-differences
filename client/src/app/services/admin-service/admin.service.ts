import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameConstantsSettingsComponent } from '@app/components/game-constants-settings/game-constants-settings.component';
import { GameConstants } from '@app/interfaces/game-constants';
import { CommunicationService } from '@app/services/communication/communication.service';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { SocketEvent } from '@common/socket-event';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    gameConstants: GameConstants;

    // eslint-disable-next-line max-params
    constructor(
        private readonly matDialog: MatDialog,
        private readonly gameCarouselService: GameCarouselService,
        private readonly communicationService: CommunicationService,
        private readonly socketService: CommunicationSocketService,
    ) {}

    hasCards(): boolean {
        return this.gameCarouselService.hasCards();
    }

    deleteAllGames(): void {
        this.socketService.send(SocketEvent.GamesDeleted);
        this.communicationService.deleteAllGameCards().subscribe();
    }

    openSettings(): void {
        this.matDialog.open(GameConstantsSettingsComponent);
    }
}
