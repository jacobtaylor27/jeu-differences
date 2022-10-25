/* eslint-disable max-lines */
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

        service['sio'] = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        stub(service['gameManager'], 'createGame')
            .callsFake(async () => new Promise(() => ''))
            .resolves();
        service.handleSockets();
    });

    it('should not leave a game if the game is not found', () => {
        const fakeSockets = {
            // eslint-disable-next-line no-unused-vars
            emit: (eventName: string, _message: string) => {
                expect(eventName).to.equal(SocketEvent.Error);
            },
        };

        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.LeaveGame) callback();
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

        service['sio'] = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        stub(service['gameManager'], 'isGameFound').callsFake(() => false);
        service.handleSockets();
    });

    it('should find difference if the game is not found', () => {
        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.Difference) callback();
            },
            // eslint-disable-next-line no-unused-vars
            emit: (eventName: string, message: string) => {
                expect(eventName).to.equal(SocketEvent.Error);
            },
            // eslint-disable-next-line no-unused-vars
            join: (id: string) => {
                return;
            },
        };

        service['sio'] = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        stub(service['gameManager'], 'isGameFound').callsFake(() => false);
        service.handleSockets();
    });

    it('should return an error if no difference found and the game is found', () => {
        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.Difference) callback();
            },
            // eslint-disable-next-line no-unused-vars
            emit: (eventName: string, message: string) => {
                expect(eventName).to.equal(SocketEvent.DifferenceNotFound);
            },
            // eslint-disable-next-line no-unused-vars
            join: (id: string) => {
                return;
            },
        };

        service['sio'] = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        stub(service['gameManager'], 'isGameFound').callsFake(() => true);
        stub(service['gameManager'], 'isDifference').callsFake(() => null);
        service.handleSockets();
    });

    it('should return found difference in solo if the game is  found', () => {
        const expectedDifferenceFound = {
            difference: { coords: [], isPlayerFoundDifference: true },
            isGameOver: false,
            nbDifferencesLeft: 2,
        };
        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.Difference) callback();
            },
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
            emit: (eventName: string, message: any) => {
                expect(eventName).to.equal(SocketEvent.DifferenceFound);
                expect(message).to.deep.equal(expectedDifferenceFound);
            },
            // eslint-disable-next-line no-unused-vars
            join: (id: string) => {
                return;
            },
        };

        service['sio'] = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        stub(service['gameManager'], 'isDifference').callsFake(() => expectedDifferenceFound.difference.coords);
        stub(service['gameManager'], 'getNbDifferencesFound').callsFake(() => expectedDifferenceFound);
        stub(service['gameManager'], 'isGameFound').callsFake(() => true);
        service.handleSockets();
    });

    it('should return found difference in multi if the game is  found', () => {
        const expectedDifferenceFound = {
            difference: { coords: [], isPlayerFoundDifference: true },
            isGameOver: false,
            nbDifferencesLeft: 2,
        };
        const fakeSockets = {
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
            emit: (eventName: string, message: any) => {
                expect(eventName).to.equal(SocketEvent.DifferenceFound);
                expect(message).to.deep.equal(expectedDifferenceFound);
            },
        };

        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.Difference) callback();
            },
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
            emit: (eventName: string, message: any) => {
                expect(eventName).to.equal(SocketEvent.DifferenceFound);
                expect(message).to.deep.equal(expectedDifferenceFound);
            },
            // eslint-disable-next-line no-unused-vars
            join: (id: string) => {
                return;
            },
            to: () => fakeSockets,
        };

        service['sio'] = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        stub(service['gameManager'], 'isDifference').callsFake(() => expectedDifferenceFound.difference.coords);
        stub(service['gameManager'], 'isGameMultiplayer').callsFake(() => true);
        stub(service['gameManager'], 'getNbDifferencesFound').callsFake(() => expectedDifferenceFound);
        stub(service['gameManager'], 'isGameFound').callsFake(() => true);
        service.handleSockets();
    });

    it('should not join a game if the game is not found or the game is full', () => {
        const fakeSockets = {
            // eslint-disable-next-line no-unused-vars
            emit: (eventName: string, _message: string) => {
                expect(eventName).to.equal(SocketEvent.Error);
            },
        };

        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.JoinGame) callback();
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

        service['sio'] = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        stub(service['gameManager'], 'isGameFound').callsFake(() => false);
        stub(service['gameManager'], 'isGameAlreadyFull').callsFake(() => true);
        service.handleSockets();
    });

    it('should join a game if the game is not full', () => {
        const fakeSockets = {
            // eslint-disable-next-line no-unused-vars
            emit: (eventName: string, _message: string) => {
                expect(eventName).to.equal(SocketEvent.Play);
            },
        };

        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.JoinGame) {
                    callback();
                }
            },
            // eslint-disable-next-line no-unused-vars
            emit: (eventName: string, message: string) => {
                expect(eventName).to.equal(SocketEvent.JoinGame);
            },
            // eslint-disable-next-line no-unused-vars
            join: (id: string) => {
                return;
            },
            in: () => fakeSockets,
        };

        service['sio'] = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        stub(service['gameManager'], 'isGameFound').callsFake(() => true);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        stub(service['gameManager'], 'addPlayer').callsFake(() => {});
        stub(service['gameManager'], 'isGameAlreadyFull').callsFake(() => false);
        service.handleSockets();
    });

    it('should leave a game if the game is found for solo', () => {
        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.LeaveGame) callback();
            },
            // eslint-disable-next-line no-unused-vars
            emit: (eventName: string, message: string) => {
                expect(eventName).to.equal(SocketEvent.LeaveGame);
            },
            // eslint-disable-next-line no-unused-vars
            join: (id: string) => {
                return;
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            leave: () => {},
        };

        service['sio'] = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        const spyLeaveRoom = spy(fakeSocket, 'leave');
        stub(service['gameManager'], 'isGameFound').callsFake(() => true);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        stub(service['gameManager'], 'leaveGame').callsFake(() => {});
        stub(service['gameManager'], 'isGameMultiplayer').callsFake(() => false);
        service.handleSockets();
        expect(spyLeaveRoom.called).to.equal(true);
    });

    it('should leave a game if the game is found for multiplayer', () => {
        const fakeSockets = {
            emit: (eventName: string) => {
                expect(eventName).to.equal(SocketEvent.Win);
            },
        };
        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.LeaveGame) callback();
            },
            // eslint-disable-next-line no-unused-vars
            emit: (eventName: string, message: string) => {
                expect(eventName).to.equal(SocketEvent.LeaveGame);
            },
            // eslint-disable-next-line no-unused-vars
            join: (id: string) => {
                return;
            },
            to: () => fakeSockets,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            leave: () => {},
        };

        service['sio'] = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        const spyLeaveRoom = spy(fakeSocket, 'leave');
        stub(service['gameManager'], 'isGameFound').callsFake(() => true);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        stub(service['gameManager'], 'leaveGame').callsFake(() => {});
        stub(service['gameManager'], 'isGameMultiplayer').callsFake(() => true);
        service.handleSockets();
        expect(spyLeaveRoom.called).to.equal(true);
    });
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
