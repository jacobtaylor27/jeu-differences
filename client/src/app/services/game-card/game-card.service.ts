import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserNameInputComponent } from '@app/components/user-name-input/user-name-input.component';
import { GameCard } from '@app/interfaces/game-card';
import { GameCardHandlerService } from '@app/services/game-card-handler/game-card-handler.service';

@Injectable({
    providedIn: 'root',
})
export class GameCardService {
    constructor(private readonly matDialog: MatDialog, private readonly gameCardHandlerService: GameCardHandlerService) {}

    openNameDialog() {
        this.matDialog.open(UserNameInputComponent);
    }

    deleteGame(game: GameCard) {
        this.gameCardHandlerService.deleteGame(game);
    }

    resetHighScores(game: GameCard) {
        this.gameCardHandlerService.resetHighScores(game);
    }
}
