import { SocketEvent } from '@app/constants/socket-event';
import * as http from 'http';
import { Server } from 'socket.io';
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
    }
}
