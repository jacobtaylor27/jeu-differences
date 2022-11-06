/* eslint-disable max-lines */
import { Server } from '@app/server';
import { SocketManagerService } from '@app/services/socket-manager-service/socket-manager-service.service';
import { SocketEvent } from '@common/socket-event';
import { expect } from 'chai';
import { restore, stub } from 'sinon';
import * as io from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
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
        const fakeSockets = {
            // eslint-disable-next-line no-unused-vars
            emit: (_eventName: string, _message: string) => {
                return;
            },
            // eslint-disable-next-line no-unused-vars
            to: (id: string) => {
                return;
            },
        };

        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function
            on: (_eventName: string, callback: () => void) => {},
            // eslint-disable-next-line no-unused-vars
            emit: (_eventName: string, _message: string) => {
                return;
            },
            // eslint-disable-next-line no-unused-vars
            join: (id: string) => {
                return;
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            broadcast: fakeSockets,
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

    it('should create a game in solo', async () => {
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

    it('should leave a game if the game is found', () => {
        const fakeSockets = {
            // eslint-disable-next-line no-unused-vars
            emit: (eventName: string, _message: string) => {
                expect(eventName).to.equal(SocketEvent.Win);
            },
        };

        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.LeaveGame) callback();
            },
            broadcast: { to: () => fakeSockets },
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
        stub(service['gameManager'], 'isGameFound').callsFake(() => true);
        stub(service['gameManager'], 'isGameMultiplayer').callsFake(() => true);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyLeaveGame = stub(service['gameManager'], 'leaveGame').callsFake(() => {});
        service.handleSockets();
        expect(spyLeaveGame.called).to.equal(true);
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

    it('should return found difference in solo if the game is found', () => {
        const expectedDifferenceFound = {
            coords: [],
            isPlayerFoundDifference: true,
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
        stub(service['gameManager'], 'isDifference').callsFake(() => expectedDifferenceFound.coords);
        stub(service['gameManager'], 'getNbDifferencesFound').callsFake(() => expectedDifferenceFound);
        stub(service['gameManager'], 'isGameFound').callsFake(() => true);
        stub(service['gameManager'], 'isGameOver').callsFake(() => false);
        service.handleSockets();
    });

    it('should return found difference in solo if the game is found and game over the game', () => {
        const expectedDifferenceFound = {
            coords: [],
            isPlayerFoundDifference: true,
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
                expect(eventName === SocketEvent.Win || eventName === SocketEvent.DifferenceFound).to.equal(true);
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
        stub(service['gameManager'], 'isDifference').callsFake(() => expectedDifferenceFound.coords);
        stub(service['gameManager'], 'getNbDifferencesFound').callsFake(() => expectedDifferenceFound);
        stub(service['gameManager'], 'isGameFound').callsFake(() => true);
        stub(service['gameManager'], 'isGameOver').callsFake(() => false);
        service.handleSockets();
    });

    it('should return found difference in multi if the game is found', () => {
        const expectedDifferenceFound = {
            coords: [],
            isPlayerFoundDifference: true,
            isGameOver: false,
            nbDifferencesLeft: 2,
        };
        const fakeSockets = {
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
            emit: (eventName: string, message: any) => {
                expect(eventName).to.equal(SocketEvent.DifferenceFound);
                expect(message).to.deep.equal(expectedDifferenceFound);
            },
            // eslint-disable-next-line no-unused-vars
            to: (id: string) => {
                // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function
                return { emit: (eventName: string, message: unknown) => {} };
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
            broadcast: fakeSockets,
        };

        service['sio'] = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        stub(service['gameManager'], 'isDifference').callsFake(() => expectedDifferenceFound.coords);
        stub(service['gameManager'], 'isGameMultiplayer').callsFake(() => true);
        stub(service['gameManager'], 'getNbDifferencesFound').callsFake(() => expectedDifferenceFound);
        stub(service['gameManager'], 'isGameOver').callsFake(() => false);
        stub(service['gameManager'], 'isGameFound').callsFake(() => true);
        service.handleSockets();
    });

    it('should return found difference in multi if the game is found and game over the game', () => {
        const expectedDifferenceFound = {
            coords: [],
            isPlayerFoundDifference: true,
            isGameOver: false,
            nbDifferencesLeft: 2,
        };
        const fakeSockets = {
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
            emit: (eventName: string, message: any) => {
                expect(eventName).to.equal(SocketEvent.DifferenceFound);
                expect(message).to.deep.equal(expectedDifferenceFound);
            },
            // eslint-disable-next-line no-unused-vars
            to: (id: string) => {
                return {
                    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function
                    emit: (eventName: string, message: unknown) => {
                        expect(eventName === SocketEvent.Lose || eventName === SocketEvent.DifferenceFound).to.equal(true);
                    },
                };
            },
        };

        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.Difference) callback();
            },
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
            emit: (eventName: string, message: any) => {
                expect(eventName === SocketEvent.Win || eventName === SocketEvent.DifferenceFound).to.equal(true);
            },
            // eslint-disable-next-line no-unused-vars
            join: (id: string) => {
                return;
            },
            to: () => fakeSockets,
            broadcast: fakeSockets,
        };

        service['sio'] = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        stub(service['gameManager'], 'isDifference').callsFake(() => expectedDifferenceFound.coords);
        stub(service['gameManager'], 'isGameMultiplayer').callsFake(() => true);
        stub(service['gameManager'], 'getNbDifferencesFound').callsFake(() => expectedDifferenceFound);
        stub(service['gameManager'], 'isGameOver').callsFake(() => true);
        stub(service['gameManager'], 'isGameFound').callsFake(() => true);
        service.handleSockets();
    });

    it('should get games waiting', () => {
        const expectedGames = ['game1', 'game2'];

        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.GetGamesWaiting) callback();
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            emit: (eventName: string, message: any) => {
                expect(eventName).to.equal(SocketEvent.GetGamesWaiting);
                expect(message).to.deep.equal(expectedGames);
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
        stub(service['multiplayerGameManager'], 'getGamesWaiting').callsFake(() => expectedGames);
        service.handleSockets();
    });

    it('should handle a message receive from client', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.Message) callback();
            },
            broadcast: {
                to: () => {
                    return {
                        // eslint-disable-next-line no-unused-vars
                        emit: (eventName: string, _message: unknown) => {
                            expect(eventName).to.equal(SocketEvent.Message);
                        },
                    };
                },
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
        service.handleSockets();
    });

    it('should reject player', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.RejectPlayer) callback();
            },
        };

        service['sio'] = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            to: () => {
                return {
                    // eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions, no-unused-vars
                    emit: (eventName: string, message: unknown) => {
                        expect(eventName === SocketEvent.RequestToJoin || eventName === SocketEvent.RejectPlayer).to.equal(true);
                    },
                };
            },
        } as unknown as io.Server;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        stub(service['multiplayerGameManager'], 'deleteFirstRequest').callsFake(() => {});
        stub(service['multiplayerGameManager'], 'theresARequest').callsFake(() => true);
        stub(service['multiplayerGameManager'], 'getNewRequest').callsFake(() => {
            return { name: 'test', id: '' };
        });
        service.handleSockets();
    });

    it('should join the game', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.JoinGame) callback();
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
            emit: (eventName: string, message: any) => {
                expect(eventName).to.equal(SocketEvent.Play);
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function, no-unused-vars
            join: (id: string) => {},
        };

        service['sio'] = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            // eslint-disable-next-line no-unused-vars
            to: (id: string) => fakeSocket,
        } as unknown as io.Server;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        stub(service['gameManager'], 'addPlayer').callsFake(() => {});
        service.handleSockets();
    });

    it('should not accept if no request found', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.AcceptPlayer) callback();
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
            emit: (eventName: string, message: any) => {
                expect(eventName).to.equal(SocketEvent.GetGamesWaiting);
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function, no-unused-vars
            join: (id: string) => {},
        };

        service['sio'] = {
            sockets: fakeSocket,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            // eslint-disable-next-line no-unused-vars
            to: (id: string) => fakeSocket,
        } as unknown as io.Server;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        stub(service['multiplayerGameManager'], 'removeGameWaiting').callsFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        stub(service['multiplayerGameManager'], 'getRequest').callsFake(() => undefined);
        service.handleSockets();
    });

    it('should accept a player if a main player accepted', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.AcceptPlayer) callback();
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
            emit: (eventName: string, message: any) => {
                expect(
                    eventName === SocketEvent.JoinGame || eventName === SocketEvent.GetGamesWaiting || eventName === SocketEvent.RejectPlayer,
                ).to.equal(true);
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function, no-unused-vars
            join: (id: string) => {},
        };

        service['sio'] = {
            sockets: fakeSocket,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            // eslint-disable-next-line no-unused-vars
            to: (id: string) => fakeSocket,
        } as unknown as io.Server;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        stub(service['gameManager'], 'setTimer').callsFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        stub(service['gameManager'], 'sendTimer').callsFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        stub(service['multiplayerGameManager'], 'removeGameWaiting').callsFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        stub(service['multiplayerGameManager'], 'deleteAllRequests').callsFake(() => {});
        stub(service['multiplayerGameManager'], 'isNotAPlayersRequest').callsFake(() => true);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        stub(service['multiplayerGameManager'], 'getRequest').callsFake(() => [{ name: 'test', id: '0' }]);
        service.handleSockets();
    });

    it('should disconnect a client', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.Disconnect) callback();
            },
        };

        service['sio'] = {
            sockets: fakeSocket,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as unknown as io.Server;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyLog = stub(console, 'log').callsFake(() => {});
        service.handleSockets();
        expect(spyLog.called).to.equal(true);
    });

    it('should create a game in solo', async () => {
        const fakeSocket = {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            join: () => {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            emit: () => {},
        } as unknown as io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spySetTimer = stub(service['gameManager'], 'setTimer').callsFake(() => {});
        const spyCreateGame = stub(service['gameManager'], 'createGame').callsFake(async () => {
            return new Promise(() => '');
        });
        spyCreateGame.resolves();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spySendTimer = stub(service['gameManager'], 'sendTimer').callsFake(() => {});
        const spyEmit = stub(fakeSocket, 'emit');
        const spyJoin = stub(fakeSocket, 'join');
        await service.createGameSolo('player', '', { card: '', isMulti: false }, fakeSocket);
        expect(spySetTimer.called).to.equal(true);
        expect(spyCreateGame.called).to.equal(true);
        expect(spySendTimer.called).to.equal(true);
        expect(spyEmit.called).to.equal(true);
        expect(spyJoin.called).to.equal(true);
    });
        const spyJoin = stub(fakeSocket, 'join');
});
