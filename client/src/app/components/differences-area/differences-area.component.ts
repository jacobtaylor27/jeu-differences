import { Component } from '@angular/core';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

@Component({
    selector: 'app-differences-area',
    templateUrl: './differences-area.component.html',
    styleUrls: ['./differences-area.component.scss'],
})
export class DifferencesAreaComponent {
    name: string;
    constructor(private readonly gameInformationHandlerService: GameInformationHandlerService) {
        this.name = this.gameInformationHandlerService.playerName;
    }
}
