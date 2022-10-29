import { Component, OnInit } from '@angular/core';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { ExitButtonHandlerService } from '@app/services/exit-button-handler/exit-button-handler.service';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-waiting-room',
    templateUrl: './waiting-room.component.html',
    styleUrls: ['./waiting-room.component.scss'],
})
export class WaitingRoomComponent implements OnInit {
    favoriteTheme: string = 'deeppurple-amber-theme';

    constructor(private exitButton: ExitButtonHandlerService, private socketService : CommunicationSocketService) {
        this.exitButton.setWaitingRoom();
    }

    ngOnInit(): void {
        this.socketService.on(SocketEvent.RequestToJoin, (playerName : string) => {
           console.log(playerName);
        })
    }
}
