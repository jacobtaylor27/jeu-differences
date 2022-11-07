import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { MultiplayerGameManager } from '@app/services/multiplayer-game-manager/multiplayer-game-manager.service';
import { Coordinate } from '@common/coordinate';
import { SocketEvent } from '@common/socket-event';
import * as http from 'http';
import { Server, Socket } from 'socket.io';
import { Service } from 'typedi';
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

            socket.on(
                SocketEvent.CreateGame,
                async (player: string, mode: string, game: { card: string; isMulti: boolean }) =>
                    await this.createGameSolo(player, mode, game, socket),
            );

            socket.on(
                SocketEvent.CreateGameMulti,
                async (player: string, mode: string, game: { card: string; isMulti: boolean }) =>
                    await this.createGameMulti(player, mode, game, socket),
            );
            socket.on(SocketEvent.Message, (message: string, roomId: string) => {
                socket.broadcast.to(roomId).emit(SocketEvent.Message, message);
            });

            socket.on(SocketEvent.AcceptPlayer, (roomId: string, opponentsRoomId: string, playerName: string) => {
                this.multiplayerGameManager.removeGameWaiting(roomId);
                this.sio.sockets.emit(SocketEvent.GetGamesWaiting, this.multiplayerGameManager.getGamesWaiting());
                const request = this.multiplayerGameManager.getRequest(roomId);
                if (!request) {
                    return;
                }
                for (const player of request) {
                    if (this.multiplayerGameManager.isNotAPlayersRequest(player.id, roomId)) {
                        this.sio.to(player.id).emit(SocketEvent.RejectPlayer);
                    }
                }
                this.multiplayerGameManager.deleteAllRequests(roomId);
                this.sio.to(opponentsRoomId).emit(SocketEvent.JoinGame, { roomId, playerName });
                socket.join(roomId);
                this.gameManager.setTimer(roomId);
                this.gameManager.sendTimer(this.sio, roomId);
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
                this.sio.to(gameId).emit(SocketEvent.Play, gameId);
            });

            socket.on(SocketEvent.LeaveGame, (gameId: string) => {
                if (!this.gameManager.isGameFound(gameId)) {
                    socket.emit(SocketEvent.Error);
                    return;
                }
                if (this.gameManager.isGameMultiplayer(gameId) && !this.gameManager.isGameOver(gameId)) {
                    socket.broadcast.to(gameId).emit(SocketEvent.Win);
                }
                this.gameManager.leaveGame(socket.id, gameId);
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
                const differences = this.gameManager.isDifference(gameId, socket.id, differenceCoord);
                if (!differences) {
                    socket.emit(SocketEvent.DifferenceNotFound);
                    return;
                }
                if (this.gameManager.isGameOver(gameId)) {
                    this.gameManager.leaveGame(socket.id, gameId);
                    socket.emit(SocketEvent.Win);
                }
                if (this.gameManager.isGameMultiplayer(gameId)) {
                    if (this.gameManager.isGameOver(gameId)) {
                        this.gameManager.leaveGame(socket.id, gameId);
                        socket.broadcast.to(gameId).emit(SocketEvent.Lose);
                    }
                    socket.emit(SocketEvent.DifferenceFound, this.gameManager.getNbDifferencesFound(differences, gameId, true));
                    const message = 'difference trouvée par ' + this.gameManager['findGame'](gameId)?.findPlayer(socket.id);
                    socket.to(gameId).emit(SocketEvent.Message, message);
                    // console.log(this.gameManager['findGame'](gameId)?.findPlayer(socket.id));
                    socket.broadcast.to(gameId).emit(SocketEvent.DifferenceFound, this.gameManager.getNbDifferencesFound(differences, gameId, false));
                    return;
                } else {
                    socket.emit(SocketEvent.DifferenceFound, this.gameManager.getNbDifferencesFound(differences, gameId));
                }
            });
        });
    }

    // eslint-disable-next-line max-params
    async createGameSolo(player: string, mode: string, game: { card: string; isMulti: boolean }, socket: Socket) {
        const id = await this.gameManager.createGame({ player: { name: player, id: socket.id }, isMulti: game.isMulti }, mode, game.card);
        socket.join(id);
        this.gameManager.setTimer(id);
        socket.emit(SocketEvent.Play, id);
        this.gameManager.sendTimer(this.sio, id);
    }

    // eslint-disable-next-line max-params
    async createGameMulti(player: string, mode: string, game: { card: string; isMulti: boolean }, socket: Socket) {
        if (this.multiplayerGameManager.isGameWaiting(game.card)) {
            const roomId = this.multiplayerGameManager.getRoomIdWaiting(game.card);
            this.multiplayerGameManager.addNewRequest(roomId, { name: player, id: socket.id });

            socket.emit(SocketEvent.WaitPlayer);

            if (this.multiplayerGameManager.theresOneRequest(roomId)) {
                this.sio.to(this.multiplayerGameManager.getRoomIdWaiting(game.card)).emit(SocketEvent.RequestToJoin, { name: player, id: socket.id });
            }
        } else {
            const roomId = await this.gameManager.createGame({ player: { name: player, id: socket.id }, isMulti: game.isMulti }, mode, game.card);
            this.multiplayerGameManager.addGameWaiting({ gameId: game.card, roomId });
            socket.broadcast.emit(SocketEvent.GetGamesWaiting, this.multiplayerGameManager.getGamesWaiting());
            socket.emit(SocketEvent.WaitPlayer, roomId);
            socket.join(roomId);
        }
    }
}
