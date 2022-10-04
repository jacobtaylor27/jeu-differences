import { Component, Input } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { GameCardService } from '@app/services/game-card/game-card.service';

@Component({
    selector: 'app-game-card-buttons',
    templateUrl: './game-card-buttons.component.html',
    styleUrls: ['./game-card-buttons.component.scss'],
})
export class GameCardButtonsComponent {
    @Input() gameCard: GameCard;

    constructor(private readonly gameCardService: GameCardService) {}

    onClickDeleteGame(game: GameCard): void {
        this.gameCardService.deleteGame(game);
    }

    onClickResetHighScores(game: GameCard): void {
        this.gameCardService.resetHighScores(game);
    }

    onClickPlayGame(): void {
        this.gameCardService.openNameDialog();
    }
}
