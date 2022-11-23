import { Component } from '@angular/core';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { GameMode } from '@common/game-mode';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    gameMode: GameMode;
    gameName: string;

    constructor(private readonly gameInformationHandlerService: GameInformationHandlerService) {
        this.gameMode = this.gameInformationHandlerService.getGameMode();
        this.gameName = this.gameInformationHandlerService.getGameName();
        this.gameInformationHandlerService.$newGame.subscribe(() => {
            this.gameMode = this.gameInformationHandlerService.getGameMode();
            this.gameName = this.gameInformationHandlerService.getGameName();
        });
    }
}
