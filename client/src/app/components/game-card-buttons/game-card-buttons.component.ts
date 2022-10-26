import { Component, Input } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { GameCardService } from '@app/services/game-card/game-card.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

@Component({
    selector: 'app-game-card-buttons',
    templateUrl: './game-card-buttons.component.html',
    styleUrls: ['./game-card-buttons.component.scss'],
})
export class GameCardButtonsComponent {
    @Input() gameCard: GameCard;
    isAlreadyCreated: boolean = false;

    constructor(private readonly gameCardService: GameCardService, private readonly gameInfoHandlerService: GameInformationHandlerService) {}

    onClickDeleteGame(game: GameCard): void {
        this.gameCardService.deleteGame(game);
    }

    onClickResetHighScores(game: GameCard): void {
        this.gameCardService.resetHighScores(game);
    }

    onClickPlayGame(): void {
        this.gameInfoHandlerService.setGameInformation(this.gameCard.gameInformation);
        this.gameCardService.openNameDialog();
    }

    onClickCreateJoinGame(): void {
        // eslint-disable-next-line no-console
        console.log('Create/Join Game');
    }
}
