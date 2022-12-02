import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { SocketEvent } from '@common/socket-event';
import { Socket } from 'socket.io-client';
import { ClueHandlerService } from './clue-handler.service';

/* eslint-disable @typescript-eslint/no-empty-function -- connect needs to be empty (Nikolay's example)*/
class SocketClientServiceMock extends CommunicationSocketService {
    override connect() {}
}

describe('ClueHandlerService', () => {
    let service: ClueHandlerService;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;

    beforeEach(() => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        TestBed.configureTestingModule({
            imports: [AppMaterialModule, HttpClientModule, RouterTestingModule],
            providers: [{ provide: CommunicationSocketService, useValue: socketServiceMock }],
        });
        service = TestBed.inject(ClueHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should increment clue counter when clue is asked', () => {
        const expectedCount = 1;
        const spySend = spyOn(service.communicationSocket, 'send');
        service.getClue();
        socketHelper.peerSideEmit(SocketEvent.Clue, 'clue');
        socketHelper.peerSideEmit(SocketEvent.EventMessage, 'event');
        expect(spySend).toHaveBeenCalled();
        expect(service.clueAskedCounter).toEqual(expectedCount);
    });

    it('should return the number of clue asked', () => {
        service.clueAskedCounter = 3;
        const result = service.getNbCluesAsked();
        expect(result).toEqual(3);
    });
});
