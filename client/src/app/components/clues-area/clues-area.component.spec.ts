import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { AppMaterialModule } from '@app/modules/material.module';
import { ClueHandlerService } from '@app/services/clue-handler-service/clue-handler.service';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { Socket } from 'socket.io-client';
import { CluesAreaComponent } from './clues-area.component';
class SocketClientServiceMock extends CommunicationSocketService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function -- connect needs to be empty (Nikolay's example)
    override connect() {}
}

describe('CluesAreaComponent', () => {
    let component: CluesAreaComponent;
    let fixture: ComponentFixture<CluesAreaComponent>;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;
    let spyRouter: jasmine.SpyObj<Router>;
    let spyClueHandler: jasmine.SpyObj<ClueHandlerService>;
    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        spyRouter = jasmine.createSpyObj('Router', ['navigate']);
        spyClueHandler = jasmine.createSpyObj('ClueHandlerService', ['getClue', 'getNbCluesAsked']);

        await TestBed.configureTestingModule({
            declarations: [CluesAreaComponent],
            imports: [AppMaterialModule, RouterTestingModule, HttpClientModule],
            providers: [
                { provide: CommunicationSocketService, useValue: socketServiceMock },
                { provide: Router, useValue: spyRouter },
                { provide: ClueHandlerService, useValue: spyClueHandler },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CluesAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should ask for clue when i keyboard is pressed', () => {
        const getClueSpy = spyOn(component, 'getClue');
        const expectedKey = 'i';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        component.buttonDetect(buttonEvent);
        expect(getClueSpy).toHaveBeenCalled();
    });

    it('should not call clue when 3 clues have already been asked', () => {
        const componentInstance = fixture.componentInstance;
        const getClueSpy = spyOn(componentInstance, 'getClue');
        componentInstance.isDisabled = true;
        const expectedKey = 'i';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        componentInstance.buttonDetect(buttonEvent);
        expect(getClueSpy).not.toHaveBeenCalled();
    });

    it('should not increment clue counter when 3 clues have been asked', () => {
        const expectedCount = 3;
        component.clueAskedCounter = 3;
        component.isDisabled = true;
        const buttonEvent = {
            key: 'i',
        } as KeyboardEvent;
        component.buttonDetect(buttonEvent);
        expect(component.clueAskedCounter).toEqual(expectedCount);
    });

    it('should return the clue number ', () => {
        spyClueHandler.getNbCluesAsked.and.callFake(() => {
            return 1;
        });
        component.getClue();
        expect(component.clueAskedCounter).toEqual(1);
        expect(component.isDisabled).toEqual(false);
        spyClueHandler.getNbCluesAsked.and.callFake(() => {
            return 3;
        });
        component.getClue();
        expect(component.clueAskedCounter).toEqual(3);
    });
});
