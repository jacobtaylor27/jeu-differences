import { TestBed } from '@angular/core/testing';
import { SocketEvent } from '@common/socket-event';
import * as io from 'socket.io-client';
import { CommunicationSocketService } from './communication-socket.service';

describe('CommunicationSocketService', () => {
    let service: CommunicationSocketService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CommunicationSocketService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should connect to server by socket', () => {
        const spySocketAlive = spyOnProperty(Object.getPrototypeOf(service), 'isSocketAlive').and.callFake(() => false);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyConnect = spyOn(service['socket'], 'connect');
        service['connect']();
        expect(spySocketAlive).toHaveBeenCalled();
        expect(spyConnect).toHaveBeenCalled();
    });

    it('should not connect if the socket is a live', () => {
        const spySocketAlive = spyOnProperty(Object.getPrototypeOf(service), 'isSocketAlive').and.callFake(() => true);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyConnect = spyOn(service['socket'], 'connect');
        service['connect']();
        expect(spySocketAlive).toHaveBeenCalled();
        expect(spyConnect).not.toHaveBeenCalled();
    });

    it('should not disconnect if the socket is not init', () => {
        const spySocketAlive = spyOnProperty(Object.getPrototypeOf(service), 'isSocketAlive').and.callFake(() => false);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyDisconnect = spyOn(service['socket'], 'disconnect');
        service['disconnect']();
        expect(spySocketAlive).toHaveBeenCalled();
        expect(spyDisconnect).not.toHaveBeenCalled();
    });

    it('should disconnect to server by socket', () => {
        const spySocketAlive = spyOnProperty(Object.getPrototypeOf(service), 'isSocketAlive').and.callFake(() => true);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        service['socket'] = { disconnect: () => {} } as io.Socket<never, never>;
        const spyDisconnect = spyOn(service['socket'], 'disconnect');
        service['disconnect']();
        expect(spyDisconnect).toHaveBeenCalled();
        expect(spySocketAlive).toHaveBeenCalled();
    });

    it('should handle an event', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyHandleEvent = spyOn(service['socket'], 'on').and.callFake(() => {
            return {} as io.Socket<never, never>;
        });
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        service.on('' as SocketEvent, () => {});
        expect(spyHandleEvent).toHaveBeenCalled();
    });

    it('should emit an event to send to server without data', () => {
        const expectedEvent = '' as SocketEvent;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyHandleEvent = spyOn(service['socket'], 'emit').and.callFake(() => {
            return {} as io.Socket<never, never>;
        });
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        service.send(expectedEvent);
        expect(spyHandleEvent).toHaveBeenCalledWith(expectedEvent);
    });

    it('should emit an event to send to server with data', () => {
        const expectedData = 'test';
        const expectedEvent = '' as SocketEvent;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyHandleEvent = spyOn(service['socket'], 'emit').and.callFake(() => {
            return {} as io.Socket<never, never>;
        });
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        service.send<{ data: string }>(expectedEvent, { data: expectedData });
        expect(spyHandleEvent).toHaveBeenCalledWith(expectedEvent, expectedData);
    });
});
