import { Server } from '@app/server';
import { SocketManagerService } from '@app/services/socket-manager-service/socket-manager-service.service';
import { SocketEvent } from '@common/socket-event';
import { expect } from 'chai';
import { restore, spy, stub } from 'sinon';
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

    it('should connect to socket', () => {
        let isConnect = false;
        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function
            on: (_eventName: string, callback: () => void) => {
                callback();
            },
            // eslint-disable-next-line no-unused-vars
            emit: (_eventName: string, _message: string) => {
                return;
            },
            // eslint-disable-next-line no-unused-vars
            join: (id: string) => {
                return;
            },
        };
        const fakeSockets = {
            // eslint-disable-next-line no-unused-vars
            emit: (_eventName: string, _message: string) => {
                return;
            },
        };
        service['sio'] = {
            sockets: fakeSockets,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    isConnect = true;
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        service.handleSockets();
        expect(isConnect).to.equal(true);
    });

    it('should create a game', async () => {
        const fakeSockets = {
            // eslint-disable-next-line no-unused-vars
            emit: (eventName: string, _message: string) => {
                expect(eventName).to.equal(SocketEvent.CreateGame);
            },
        };

        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function
            on: async (eventName: string, callback: () => Promise<void>) => {
                if (eventName === SocketEvent.CreateGame) {
                    await callback();
                }
            },
            // eslint-disable-next-line no-unused-vars
            emit: (eventName: string, message: string) => {
                return;
            },
            // eslint-disable-next-line no-unused-vars
            join: (id: string) => {
                return;
            },
            in: () => fakeSockets,
        };
    it('should send an event without data', async () => {
        const expectedEvent = { name: 'test', data: undefined };
        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function
            emit: (eventName: string, ...args: never[]) => {},
            id: 'testId',
        };
        // const spyFetchSockets = stub().resolves([fakeSocket]);
        const fakeSockets = {
            sockets: {
                get: () => fakeSocket,
            },
        };
        service['sio'] = {
            sockets: fakeSockets,
            in: () => {
                return { fetchSockets: async () => [fakeSocket] };
            },
        } as unknown as io.Server;
        const spyEmit = spy(fakeSocket, 'emit');
        await service.send('', { name: expectedEvent.name as SocketEvent });
        expect(spyEmit.calledWith(expectedEvent.name)).to.equal(true);
    });

    it('should send an event with data', async () => {
        const expectedEvent = { name: 'test', data: 'test data' };
        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
            emit: (eventName: string, ...args: any[]) => {},
            id: 'testId',
        };
        // const spyFetchSockets = stub().resolves([fakeSocket]);
        const fakeSockets = {
            sockets: {
                get: () => fakeSocket,
            },
        };
        service['sio'] = {
            sockets: fakeSockets,
            in: () => {
                return { fetchSockets: async () => [fakeSocket] };
            },
        } as unknown as io.Server;
        const spyEmit = spy(fakeSocket, 'emit');
        await service.send('', { name: expectedEvent.name as SocketEvent, data: expectedEvent.data });
        expect(spyEmit.calledWith(expectedEvent.name, expectedEvent.data)).to.equal(true);
    });

    afterEach(() => {
        restore();
    });
});
