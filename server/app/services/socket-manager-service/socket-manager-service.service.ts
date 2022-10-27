import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { Coordinate } from '@common/coordinate';
import { SocketEvent } from '@common/socket-event';
import * as http from 'http';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Service } from 'typedi';
import { MultiplayerGameManager } from '@app/services/multiplayer-game-manager/multiplayer-game-manager.service';
@Service()
export class SocketManagerService {
    private sio: Server;

    constructor(private gameManager: GameManagerService, private readonly multiplayerGameManager: MultiplayerGameManager) {}

    set server(server: http.Server) {
        this.sio = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets(): void {
        if (!this.sio) {
            throw new Error('Server instance not set');
        }
        this.sio.on(SocketEvent.Connection, (socket: Socket) => {
            // eslint-disable-next-line no-console
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);

            socket.on(SocketEvent.Disconnect, () => {
                // eslint-disable-next-line no-console
                console.log(`Deconnexion de l'utilisateur avec id : ${socket.id}`);
            });

            socket.on(SocketEvent.CreateGame, async (player: string, mode: string, game: { card: string; isMulti: boolean }) => {
                const id = await this.gameManager.createGame({ player: { name: player, id: socket.id }, isMulti: game.isMulti }, mode, game.card);
                this.multiplayerGameManager.setGamesWaiting();
                socket.emit(SocketEvent.GetGamesWaiting, this.multiplayerGameManager.getGamesWaiting());

                socket.join(id);
                socket.in(id).emit(game.isMulti ? SocketEvent.WaitPlayer : SocketEvent.Play, id);
            });

            socket.on(SocketEvent.JoinGame, (player: string, gameId: string) => {
                if (!this.gameManager.isGameFound(gameId) || this.gameManager.isGameAlreadyFull(gameId)) {
                    socket.emit(SocketEvent.Error);
                    return;
                }
                this.gameManager.addPlayer({ name: player, id: socket.id }, gameId);
                socket.join(gameId);
                socket.emit(SocketEvent.JoinGame, gameId);
                socket.in(gameId).emit(SocketEvent.Play);
            });

            socket.on(SocketEvent.LeaveGame, (gameId: string) => {
                if (!this.gameManager.isGameFound(gameId)) {
                    socket.emit(SocketEvent.Error);
                    return;
                }
                this.gameManager.leaveGame(socket.id, gameId);
                if (this.gameManager.isGameMultiplayer(gameId)) {
                    socket.to(gameId).emit(SocketEvent.Win);
                }
                socket.emit(SocketEvent.LeaveGame);
                socket.leave(gameId);
            });

            socket.on(SocketEvent.GetGamesWaiting, () => {
                console.log('get games waiting');
                socket.emit(SocketEvent.GetGamesWaiting, this.multiplayerGameManager.getGamesWaiting());
                console.log(this.multiplayerGameManager.getGamesWaiting());
            });

            socket.on(SocketEvent.Difference, (differenceCoord: Coordinate, gameId: string) => {
                if (!this.gameManager.isGameFound(gameId)) {
                    socket.emit(SocketEvent.Error);
                    return;
                }
                if (!this.gameManager.isDifference(gameId, differenceCoord)) {
                    socket.emit(SocketEvent.DifferenceNotFound);
                    return;
                }
                socket.emit(SocketEvent.DifferenceFound, this.gameManager.getNbDifferencesFound(differenceCoord, true, gameId));
                if (this.gameManager.isGameMultiplayer(gameId)) {
                    socket.to(gameId).emit(SocketEvent.DifferenceFound, this.gameManager.getNbDifferencesFound(differenceCoord, false, gameId));
                }
            });
        });
    }

    async send<T>(gameId: string, event: { name: SocketEvent; data?: T }) {
        this.sio
            .in(gameId)
            .fetchSockets()
            .then((socketsClient) => {
                socketsClient.forEach((socketClient) => {
                    const socket = this.sio.sockets.sockets.get(socketClient.id) as Socket<DefaultEventsMap, DefaultEventsMap>;
                    if (!event.data) {
                        socket.emit(event.name);
                        return;
                    }
                    socket.emit(event.name, event.data);
                });
            });
    }
}
