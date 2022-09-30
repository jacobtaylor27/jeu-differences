import { Component } from '@angular/core';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

@Component({
    selector: 'app-user-name-input',
    templateUrl: './user-name-input.component.html',
    styleUrls: ['./user-name-input.component.scss'],
})
export class UserNameInputComponent {
    name: string;
    favoriteTheme: string = 'deeppurple-amber-theme';

    constructor(private readonly gameInformationHandlerService: GameInformationHandlerService) {}

    onClickContinue(): void {
        this.gameInformationHandlerService.setName(this.name);
    }
}
