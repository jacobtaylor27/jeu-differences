import { SocketEvent } from '@app/constants/socket-event';
import { Server } from '@app/server';
import { SocketManagerService } from '@app/services/socket-manager-service/socket-manager-service.service';
import { expect } from 'chai';
import { restore } from 'sinon';
import * as io from 'socket.io';
import { Container } from 'typedi';

describe('SocketManager', () => {
    let server: Server;
    let service: SocketManagerService;
    beforeEach(() => {
        server = Container.get(Server);
        service = server['socketManager'];
    });

    it('should throw an error if the server is not set', () => {
        try {
            service.handleSockets();
        } catch (err) {
            expect(err.message).to.equal('Server instance not set');
        }
    });

    it('set the server', () => {
        service.server = server['server'];
        expect(service['sio']).to.not.equal(undefined);
    });

    });
    afterEach(() => {
        restore();
    });
});
