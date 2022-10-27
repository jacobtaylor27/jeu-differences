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
        return this.gameCard.isMulti;
    }

    onClickDeleteGame(game: GameCard): void {
        this.gameCardService.deleteGame(game.gameInformation.id);
        this.reloadComponent();
    }

    // onClickResetHighScores(game: GameCard): void {
    //     // this.gameCardService.resetHighScores(game.gameInformation.id);
    // }

    onClickPlayGame(): void {
        this.gameInfoHandlerService.setGameInformation(this.gameCard.gameInformation);
        this.gameCardService.openNameDialog();
    }

    onClickCreateJoinGame(): void {
        this.gameInfoHandlerService.setGameInformation(this.gameCard.gameInformation);
        this.gameCardService.openNameDialog();
    }
}
