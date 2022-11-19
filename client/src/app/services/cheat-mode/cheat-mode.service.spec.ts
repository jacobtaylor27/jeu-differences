import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { Coordinate } from '@common/coordinate';
import { SocketEvent } from '@common/socket-event';

import { Socket } from 'socket.io-client';
import { CheatModeService } from './cheat-mode.service';
/* eslint-disable @typescript-eslint/no-empty-function -- connect needs to be empty (Nikolay's example)*/
class SocketClientServiceMock extends CommunicationSocketService {
    override connect() {}
}

describe('CheatModeService', () => {
    let service: CheatModeService;
    let differenceDetectionHandlerSpyObj: jasmine.SpyObj<DifferencesDetectionHandlerService>;
    let socketHelper: SocketTestHelper;
    let socketServiceMock: SocketClientServiceMock;

    beforeEach(() => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        differenceDetectionHandlerSpyObj = jasmine.createSpyObj('DifferenceDetectionHandler', ['displayDifferenceTemp']);
        TestBed.configureTestingModule({
            imports: [AppMaterialModule, HttpClientModule, RouterTestingModule],
            providers: [
                { provide: DifferencesDetectionHandlerService, useValue: differenceDetectionHandlerSpyObj },
                { provide: CommunicationSocketService, useValue: socketServiceMock },
            ],
        });
        service = TestBed.inject(CheatModeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should manage cheat mode', async () => {
        const stopSpy = spyOn(Object.getPrototypeOf(service), 'stopCheatMode').and.callFake(() => false);
        const startSpy = spyOn(Object.getPrototypeOf(service), 'startCheatMode')
            .and.callFake(async () => new Promise(() => true))
            .and.resolveTo();

        service.isCheatModeActivated = true;
        await service.manageCheatMode({} as CanvasRenderingContext2D, {} as CanvasRenderingContext2D);
        expect(stopSpy).toHaveBeenCalled();
        service.isCheatModeActivated = false;
        await service.manageCheatMode({} as CanvasRenderingContext2D, {} as CanvasRenderingContext2D);
        expect(startSpy).toHaveBeenCalled();
    });

});
