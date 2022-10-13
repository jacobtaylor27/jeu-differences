import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CommunicationSocketService {
    private socket: Socket;
    constructor() {
        if (!this.socket) {
            this.socket = io(environment.socketUrl, { transports: ['websocket'], upgrade: false });
        }
        this.connect();
    }
    private get isSocketAlive() {
        return this.socket && this.socket.connected;
    }

    disconnect() {
        if (!this.isSocketAlive) {
            return;
        }
        this.socket.disconnect();
    }

    private connect() {
        if (this.isSocketAlive) {
            return;
        }
        this.socket.connect();
    }
}
