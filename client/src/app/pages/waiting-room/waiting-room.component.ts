import { Component } from '@angular/core';
import { ExitButtonHandlerService } from '@app/services/exit-button-handler/exit-button-handler.service';

@Component({
    selector: 'app-waiting-room',
    templateUrl: './waiting-room.component.html',
    styleUrls: ['./waiting-room.component.scss'],
})
export class WaitingRoomComponent {
    favoriteTheme: string = 'deeppurple-amber-theme';

    constructor(private exitButton : ExitButtonHandlerService) {
        this.exitButton.setWaitingRoom();
    }
}
