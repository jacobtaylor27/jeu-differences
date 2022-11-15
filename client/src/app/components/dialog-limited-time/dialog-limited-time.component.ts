import { Component } from '@angular/core';
import { Theme } from '@app/enums/theme';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-dialog-limited-time',
    templateUrl: './dialog-limited-time.component.html',
    styleUrls: ['./dialog-limited-time.component.scss'],
})
export class DialogLimitedTimeComponent {
    favoriteTheme: string = Theme.ClassName;

    constructor(
        private readonly communicationSocketService: CommunicationSocketService,
        private readonly gameInformationHandlerService: GameInformationHandlerService,
    ) {}

    onClickSolo() {
        this.communicationSocketService.send(SocketEvent.CreateGame, {
            player: this.gameInformationHandlerService.players[0].name,
            mode: this.gameInformationHandlerService.gameMode,
            game: { card: undefined, isMulti: false },
        });
        this.gameInformationHandlerService.handleSocketEvent();
    }

    onClickCoop() {
        this.communicationSocketService.send(SocketEvent.CreateGameMulti, {
            player: this.gameInformationHandlerService.players[0].name,
            mode: this.gameInformationHandlerService.gameMode,
            game: { card: undefined, isMulti: true },
        });
        this.gameInformationHandlerService.handleSocketEvent();
    }
}
