import { SocketEvent } from '@common/socket-event';
import * as http from 'http';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Service } from 'typedi';
@Service()
export class SocketManagerService {
    private sio: Server;

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
        });
    }
    async send<T>(socketId: string, gameId: string, event: { name: SocketEvent; data?: T }) {
        this.sio
            .in(gameId)
            .fetchSockets()
            .then((socketsClient) => {
                socketsClient.forEach((socketClient) => {
                    const socket = this.sio.sockets.sockets.get(socketClient.id) as Socket<DefaultEventsMap, DefaultEventsMap>;
                    if (socket) {
                        if (!event.data) {
                            socket.emit(event.name);
                            return;
                        }
                        socket.emit(event.name, event.data);
                    }
                });
            });
    }
}
