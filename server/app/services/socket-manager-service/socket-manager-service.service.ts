import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { SocketEvent } from '@common/socket-event';
import * as http from 'http';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Service } from 'typedi';
@Service()
export class SocketManagerService {
    private sio: Server;

    constructor(private gameManager: GameManagerService) {}

    set server(server: http.Server) {
        this.sio = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets(): void {
        if (!this.sio) {
            throw new Error('Server instance not set');
        }
        this.sio.on(SocketEvent.Connection, (socket) => {
            // eslint-disable-next-line no-console
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);

            socket.on(SocketEvent.Disconnect, () => {
                // eslint-disable-next-line no-console
                console.log(`Deconnexion de l'utilisateur avec id : ${socket.id}`);
            });

            socket.on(SocketEvent.CreateGame, async (player: string, mode: string, game: { card: string; isMulti: boolean }) => {
                const id = await this.gameManager.createGame({ player: { name: player, id: socket.id }, isMulti: game.isMulti }, mode, game.card);
                socket.join(id);
                socket.in(id).emit(game.isMulti ? SocketEvent.WaitPlayer : SocketEvent.Play, id);
            });

            socket.on(SocketEvent.JoinGame, (player: string, gameId: string) => {
                if (!this.gameManager.isGameFound(gameId) || this.gameManager.isGameAlreadyFull(gameId)) {
                    return socket.emit(SocketEvent.Error);
                }
                this.gameManager.addPlayer(player, gameId);
                socket.join(gameId);
                socket.emit(SocketEvent.JoinGame, gameId);
                this.send(gameId, { name: SocketEvent.Play });
            socket.on(SocketEvent.LeaveGame, (gameId: string) => {
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
