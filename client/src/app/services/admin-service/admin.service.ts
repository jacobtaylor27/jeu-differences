import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameConstantsSettingsComponent } from '@app/components/game-constants-settings/game-constants-settings.component';
import { GameConstants } from '@app/interfaces/game-constants';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    gameConstants: GameConstants;

    constructor(
        private readonly matDialog: MatDialog,
        private readonly gameCarouselService: GameCarouselService,
        private readonly communicationService: CommunicationService,
    ) {}

    hasCards(): boolean {
        return this.gameCarouselService.hasCards();
    }

    deleteAllGames(): void {
        this.communicationService.deleteAllGameCards().subscribe();
    }

    openSettings(): void {
        this.matDialog.open(GameConstantsSettingsComponent);
    }
}
