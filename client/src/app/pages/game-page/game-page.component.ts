import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { ExitButtonHandlerService } from '@app/services/exit-button-handler/exit-button-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit {
    favoriteTheme: string = 'deeppurple-amber-theme';
    gameId: string;

    constructor(
        private readonly communicationService: CommunicationService,
        private communicationSocketService : CommunicationSocketService,
        private readonly gameInfoHandlerService: GameInformationHandlerService,
        exitButtonService: ExitButtonHandlerService,
    ) {
        exitButtonService.setGamePage();
    }

    ngOnInit() {
        this.createGameRoom();
        this.communicationSocketService.on(SocketEvent.Clock, (time : string) =>{
            console.log(time)
        })
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
