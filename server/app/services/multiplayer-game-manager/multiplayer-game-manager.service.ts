import { Service } from 'typedi';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { User } from '@common/user';

@Service()
export class MultiplayerGameManager {
    requestsOnHold: Map<string, User[]> = new Map();
    private gamesWaiting: { gameId: string; roomId: string }[] = [];

    constructor(private readonly gameManager: GameManagerService) {}

    theresOneRequest(roomId: string) {
        return this.requestsOnHold.get(roomId)?.length === 1;
    }

    theresARequest(roomId: string) {
        const length = this.requestsOnHold.get(roomId)?.length;
        return length ? length > 0 : false;
    }

    isNotAPlayersRequest(playersRoom: string, opponentsRoomId: string) {
        return playersRoom !== opponentsRoomId;
    }

    addNewRequest(roomId: string, player: User) {
        if (this.requestsOnHold.has(roomId)) {
            this.requestsOnHold.set(roomId, [...(this.requestsOnHold.get(roomId) as User[]), player]);
            return;
        }

        this.requestsOnHold.set(roomId, [player]);
    }

    deleteFirstRequest(roomId: string) {
        this.requestsOnHold.set(roomId, this.requestsOnHold.get(roomId)?.slice(1) as User[]);
    }

    deleteAllRequests(roomId : string){
        this.requestsOnHold.delete(roomId);
    }

    getNewRequest(roomId: string) {
        return (this.requestsOnHold.get(roomId) as User[])[0];
    }

    getGamesWaiting() {
        const gamesId = [];
        for (const game of this.gamesWaiting) {
            gamesId.push(game.gameId);
        }
        return gamesId;
    }

    isGameWaiting(gameId: string) {
        return this.gamesWaiting.map((game: { gameId: string; roomId: string }) => game.gameId).includes(gameId);
    }

    getRoomIdWaiting(gameId: string) {
        const gameWaiting = this.gamesWaiting.find((game: { gameId: string; roomId: string }) => game.gameId === gameId);
        return !gameWaiting ? '' : gameWaiting.roomId;
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

    removeGameWaiting(roomId: string) {
        console.log(this.gamesWaiting)

        this.gamesWaiting = this.gamesWaiting.filter((game : {gameId : string, roomId : string }) =>
            game.roomId !== roomId
        );
        console.log(this.gamesWaiting)

       
    }
}
