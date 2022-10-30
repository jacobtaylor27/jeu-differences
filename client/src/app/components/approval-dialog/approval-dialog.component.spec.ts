import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { SocketEvent } from '@common/socket-event';
import { Socket } from 'socket.io-client';
import { ApprovalDialogComponent } from './approval-dialog.component';

class SocketClientServiceMock extends CommunicationSocketService {
    override connect() {}
}

describe('ApprovalDialogComponent', () => {
    let component: ApprovalDialogComponent;
    let fixture: ComponentFixture<ApprovalDialogComponent>;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;

    const model = {
        data: {
            opponentsName: 'name',
        },
    };

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        await TestBed.configureTestingModule({
            declarations: [ApprovalDialogComponent],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: model },{ provide: CommunicationSocketService, useValue: socketServiceMock }],
            imports : [RouterTestingModule, HttpClientModule]
        }).compileComponents();

        fixture = TestBed.createComponent(ApprovalDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should send no to the user', () => {
        const spySend = spyOn(component.socketService, 'send');
        component.onClickReject();
        expect(spySend).toHaveBeenCalled();
    });

    it('should send to server that the player accepted the request and start the game', () => {
        const spySend = spyOn(component.socketService, 'send');
        component.onClickApprove();
        expect(spySend).toHaveBeenCalled();
        socketHelper.peerSideEmit(SocketEvent.Play);
    });
});
