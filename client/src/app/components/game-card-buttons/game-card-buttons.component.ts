import { Component, Input } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { GameCardService } from '@app/services/game-card/game-card.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { RouterService } from '@app/services/router-service/router.service';

@Component({
    selector: 'app-game-card-buttons',
    templateUrl: './game-card-buttons.component.html',
    styleUrls: ['./game-card-buttons.component.scss'],
})
export class GameCardButtonsComponent {
    @Input() gameCard: GameCard;

    constructor(
        private readonly gameCardService: GameCardService,
        private readonly gameInfoHandlerService: GameInformationHandlerService,
        private readonly router: RouterService,
    ) {}

    isMultiplayer(): boolean {
        console.log('is multi : game-cardbuttons -> ' + this.gameCard.isMulti);
        return this.gameCard.isMulti;
    }

    onClickDeleteGame(game: GameCard): void {
        this.gameCardService.deleteGame(game.gameInformation.id);
        this.router.reloadPage('admin');
    }

    onClickPlayGame(): void {
        this.gameInfoHandlerService.setGameInformation(this.gameCard.gameInformation);
        this.gameCardService.openNameDialog();
    }

    onClickCreateJoinGame(): void {
        this.gameInfoHandlerService.setGameInformation(this.gameCard.gameInformation);
        this.gameCardService.openNameDialog();
    }
}
