import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '@app/services/communication/communication.service';
import { ExitButtonHandlerService } from '@app/services/exit-button-handler/exit-button-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit {
    favoriteTheme: string = 'deeppurple-amber-theme';
    gameId: string;
    clock: string;

    constructor(
        private readonly communicationService: CommunicationService,
        private readonly gameInfoHandlerService: GameInformationHandlerService,
        exitButtonService: ExitButtonHandlerService,
    ) {
        exitButtonService.setGamePage();
    }

    ngOnInit() {
        this.createGameRoom();
    }

    createGameRoom() {
        this.communicationService
            .createGameRoom(
                this.gameInfoHandlerService.getPlayerName(),
                this.gameInfoHandlerService.getGameMode(),
                this.gameInfoHandlerService.getId(),
            )
            .subscribe((response: HttpResponse<{ id: string }> | null) => {
                if (!response || !response.body) {
                    return;
                }
                this.gameId = response.body.id;
            });
    }
}
