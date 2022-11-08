import { Component, Input } from '@angular/core';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { GameMode } from '@common/game-mode';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    @Input() timer = '';
    gameMode: GameMode;
    gameName: string;

    constructor(private readonly gameInformationHandlerService: GameInformationHandlerService) {
        this.getGameInformation();
    }

    getGameInformation(): void {
        this.gameMode = this.getGameMode();
        this.gameName = this.getGameName();
    }

    getGameName() {
        return this.gameInformationHandlerService.getGameName();
    }

    getGameMode() {
        return this.gameInformationHandlerService.getGameMode();
    }
}
