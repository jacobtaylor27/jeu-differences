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

    afterEach(() => {
        restore();
    });
});
