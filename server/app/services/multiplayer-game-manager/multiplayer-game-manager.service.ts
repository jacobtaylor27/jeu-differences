import { Service } from 'typedi';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { Game } from '@app/classes/game/game';

@Service()
export class MultiplayerGameManager {
    private gamesWaiting: string[] = [];

    constructor(private readonly gameManager: GameManagerService) {}

    getGamesWaiting(): string[] {
        return this.gamesWaiting;
    }

    setGamesWaiting(): void {
        this.gamesWaiting = [];
        for (const game of this.gameManager.games) {
            if (this.gameHasSpaceLeft(game)) {
                this.addGameWaiting(game.information.id);
            }
        }
    }

    gameHasSpaceLeft(game: Game): boolean {
        return game.multi;
    }


    isGameWaiting(game : string): boolean {
        for (const gameWaiting of this.gameManager.games) {
            if (game === gameWaiting.information.id) {
                return true;
            }
    }
    return false;
}

    addGameWaiting(gameId: string): void {
        this.gamesWaiting.push(gameId);
    }

}
