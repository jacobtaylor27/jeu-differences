import { Service } from 'typedi';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';

@Service()
export class MultiplayerGameManager {
    private gamesWaiting: { gameId: string; roomId: string }[] = [];

    constructor(private readonly gameManager: GameManagerService) {}

    getGamesWaiting() {
        const gamesId = [];
        for (const game of this.gamesWaiting) {
            gamesId.push(game.gameId);
        }
        return gamesId;
    }

    isGameWaiting(gameId: string) {
        for (const game of this.gamesWaiting) {
            if (gameId === game.gameId) {
                return true;
            }
        }
        return false;
    }

    getRoomIdWaiting(gameId: string) {
const game = this.gamesWaiting.find((game: { gameId: string; roomId: string }) => game.gameId === gameId);
return !game ? '' : game.roomId;
    }

    setGamesWaiting(): void {
        this.gamesWaiting = [];
        for (const game of this.gameManager.games) {
            if (game.multi) {
                this.addGameWaiting({ gameId: game.information.id, roomId: game.identifier });
            }
        }
    }

    addGameWaiting(infos: { gameId: string; roomId: string }): void {
        this.gamesWaiting.push(infos);
    }
}
