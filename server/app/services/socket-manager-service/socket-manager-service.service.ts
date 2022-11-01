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
                socket.join(id);
                this.gameManager.setTimer(id);
                socket.emit(SocketEvent.Play, id);
                /* eslint-disable @typescript-eslint/no-magic-numbers -- send every one second */
                setInterval(() => {
                    if (!this.gameManager.isGameOver(id)) {
                        this.sio.sockets.to(id).emit('clock', this.gameManager.getTime(id));
                    }
                }, 1000);
            });

            socket.on(SocketEvent.CreateGameMulti, async (player: string, mode: string, game: { card: string; isMulti: boolean }) => {
                if (this.multiplayerGameManager.isGameWaiting(game.card)) {
                    const roomId = this.multiplayerGameManager.getRoomIdWaiting(game.card);
                    this.multiplayerGameManager.addNewRequest(roomId, { name: player, id: socket.id });

                    socket.emit(SocketEvent.WaitPlayer);

                    if (this.multiplayerGameManager.theresOneRequest(roomId)) {
                        this.sio
                            .to(this.multiplayerGameManager.getRoomIdWaiting(game.card))
                            .emit(SocketEvent.RequestToJoin, { name: player, id: socket.id });
                    }
                } else {
                    const roomId = await this.gameManager.createGame(
                        { player: { name: player, id: socket.id }, isMulti: game.isMulti },
                        mode,
                        game.card,
                    );
                    this.multiplayerGameManager.addGameWaiting({ gameId: game.card, roomId });
                    socket.broadcast.emit(SocketEvent.GetGamesWaiting, this.multiplayerGameManager.getGamesWaiting());
                    socket.emit(SocketEvent.WaitPlayer, roomId);
                    socket.join(roomId);
                }
            });
            socket.on(SocketEvent.Message, (message: string, roomId: string) => {
                socket.broadcast.to(roomId).emit(SocketEvent.Message, message);
                // this.sio.to(roomId).emit(SocketEvent.Message, message);
            });

            socket.on(SocketEvent.AcceptPlayer, (roomId: string, opponentsRoomId: string) => {
                this.multiplayerGameManager.removeGameWaiting(roomId);
                this.sio.sockets.emit(SocketEvent.GetGamesWaiting, this.multiplayerGameManager.getGamesWaiting());
                for (const player of this.multiplayerGameManager.requestsOnHold.get(roomId) as User[]) {
                    if (this.multiplayerGameManager.isNotAPlayersRequest(player.id, roomId)) {
                        this.sio.to(player.id).emit(SocketEvent.RejectPlayer);
                    }
                }
                this.multiplayerGameManager.deleteAllRequests(roomId);
                this.sio.to(opponentsRoomId).emit(SocketEvent.JoinGame, roomId);
            });

            socket.on(SocketEvent.RejectPlayer, (roomId: string, opponentsRoomId: string) => {
                this.multiplayerGameManager.deleteFirstRequest(roomId);
                if (this.multiplayerGameManager.theresARequest(roomId)) {
                    const newPlayerRequest = this.multiplayerGameManager.getNewRequest(roomId);
                    this.sio.to(roomId).emit(SocketEvent.RequestToJoin, newPlayerRequest);
                }

                this.sio.to(opponentsRoomId).emit(SocketEvent.RejectPlayer);
            });

            socket.on(SocketEvent.JoinGame, (player: string, gameId: string) => {
                this.gameManager.addPlayer({ name: player, id: socket.id }, gameId);
                socket.join(gameId);
                this.sio.to(gameId).emit(SocketEvent.Play);
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
                socket.emit(SocketEvent.GetGamesWaiting, this.multiplayerGameManager.getGamesWaiting());
            });

            socket.on(SocketEvent.Difference, (differenceCoord: Coordinate, gameId: string) => {
                if (!this.gameManager.isGameFound(gameId)) {
                    socket.emit(SocketEvent.Error);
                    return;
                }
                if (!this.gameManager.isDifference(gameId, differenceCoord)) {
                    socket.to(gameId).emit(SocketEvent.DifferenceNotFound);
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
