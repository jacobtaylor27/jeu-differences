import { User } from '@common/user';
import { Service } from 'typedi';

@Service()
export class MultiplayerGameManager {
    requestsOnHold: Map<string, User[]> = new Map();
    private gamesWaiting: { gameId: string; roomId: string }[] = [];

    theresOneRequest(roomId: string) {
        return this.requestsOnHold.get(roomId)?.length === 1;
    }

    theresARequest(roomId: string) {
        const length = this.requestsOnHold.get(roomId)?.length;
        return length ? length > 0 : false;
    }

    playersRequestExists(roomId: string, playerId: string) {
        const requests = this.getRequest(roomId);
        if (requests) {
            for (const request of requests) {
                if (request.id === playerId) {
                    return true;
                }
            }
        }
        return false;
    }

    getRequest(gameId: string) {
        return this.requestsOnHold.has(gameId) ? this.requestsOnHold.get(gameId) : [];
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

    deleteAllRequests(roomId: string) {
        this.requestsOnHold.delete(roomId);
    }

    deleteRequest(roomId: string, playerId: string) {
        const requests = this.getRequest(roomId);
        if (requests) {
            for (let i = 0; i < requests.length; i++) {
                if (requests[i].id === playerId) {
                    requests.splice(i, 1);
                }
            }
        }

        if (requests) this.requestsOnHold.set(roomId, requests);
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

    addGameWaiting(infos: { gameId: string; roomId: string }): void {
        this.gamesWaiting.push(infos);
    }

    removeGameWaiting(roomId: string) {
        this.gamesWaiting = this.gamesWaiting.filter((game: { gameId: string; roomId: string }) => game.roomId !== roomId);
    }
}
