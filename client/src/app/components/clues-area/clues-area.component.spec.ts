import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { SocketEvent } from '@common/socket-event';
import { CluesAreaComponent } from './clues-area.component';
class SocketClientServiceMock extends CommunicationSocketService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function -- connect needs to be empty (Nikolay's example)
    override connect() {}
}

describe('CluesAreaComponent', () => {
    let component: CluesAreaComponent;
    let fixture: ComponentFixture<CluesAreaComponent>;
    let spyRouter: jasmine.SpyObj<Router>;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CluesAreaComponent],
            imports: [AppMaterialModule],
            providers: [
                { provide: CommunicationSocketService, useValue: socketServiceMock },
                { provide: Router, useValue: spyRouter },
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

    it('should increment clue counter when clue is asked', () => {
        const expectedCount = 1;
        const spyUsingClue = spyOn(component, 'getClue');
        const spySend = spyOn(component.communicationSocket, 'send');
        component.getClue();
        socketHelper.peerSideEmit(SocketEvent.Clue, 'clue');
        socketHelper.peerSideEmit(SocketEvent.EventMessage, 'event');
        expect(spySend).toHaveBeenCalled();
        expect(spyUsingClue).toHaveBeenCalled();
        expect(component.clueAskedCounter).toEqual(expectedCount);
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

    it('should disable clue function on third clue asked', () => {
        component.clueAskedCounter = 2;
        component.getClue();
        expect(component.isDisabled).toBeTrue();
    });
});
