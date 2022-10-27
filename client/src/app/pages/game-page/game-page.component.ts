import { Component } from '@angular/core';
import { ExitButtonHandlerService } from '@app/services/exit-button-handler/exit-button-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    favoriteTheme: string = 'deeppurple-amber-theme';
    clock: string;

    constructor(public gameInfoHandlerService: GameInformationHandlerService, exitButtonService: ExitButtonHandlerService) {
        exitButtonService.setGamePage();
    }
}
