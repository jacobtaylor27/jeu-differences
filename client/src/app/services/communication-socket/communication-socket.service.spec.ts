import { TestBed } from '@angular/core/testing';
import * as io from 'socket.io-client';
import { CommunicationSocketService } from './communication-socket.service';

fdescribe('CommunicationSocketService', () => {
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
        service['connect']();
        expect(spySocketAlive).toHaveBeenCalled();
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
});
