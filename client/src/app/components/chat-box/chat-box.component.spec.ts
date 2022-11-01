import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { ChatBoxComponent } from '@app/components/chat-box/chat-box.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { SocketEvent } from '@common/socket-event';
import { Socket } from 'socket.io-client';
class SocketClientServiceMock extends CommunicationSocketService {
    override connect() {}
}

describe('ChatBoxComponent', () => {
    let component: ChatBoxComponent;
    let fixture: ComponentFixture<ChatBoxComponent>;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;
    let spyRouter: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        spyRouter = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            declarations: [ChatBoxComponent],
            imports: [AppMaterialModule, NoopAnimationsModule, FormsModule, RouterTestingModule],
            providers: [
                { provide: CommunicationSocketService, useValue: socketServiceMock },
                { provide: Router, useValue: spyRouter },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ChatBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should send the message when enter key is pressed', () => {
        const spyClick = spyOn(component, 'onClickSend');
        const key = { key: 'Enter' } as KeyboardEvent;
        component.onDialogClick(key);
        expect(spyClick).toHaveBeenCalled();
    });

    it('should push the message into messages array when message event is heard', () => {
        const spyAddingMessage = spyOn(component, 'addingMessage');
        socketHelper.peerSideEmit(SocketEvent.Message, 'message');
        expect(spyAddingMessage).toHaveBeenCalled();
    });

    it('should add the user message into array with personal type', () => {
        component.messages = [];
        const messageTest = 'message';
        const userType = 'personal';
        component.addingMessage(messageTest, userType);
        expect(component.messages).toHaveSize(1);
        expect(component.messages[0].type).toEqual('personal');
    });

    it('should add the adversary user message into array with adversary type', () => {
        component.messages = [];
        const messageTest = 'message';
        const userType = 'adversary';
        component.addingMessage(messageTest, userType);
        expect(component.messages).toHaveSize(1);
        expect(component.messages[0].type).toEqual('adversary');
    });

    it('should send the message onClick', () => {
        const spyAddingMessage = spyOn(component, 'addingMessage');
        const spySend = spyOn(component.communicationSocket, 'send');
        component.onClickSend();
        socketHelper.peerSideEmit(SocketEvent.Message, 'message');
        expect(spySend).toHaveBeenCalled();
        expect(spyAddingMessage).toHaveBeenCalled();
        expect(component.currentMessage).toEqual('');
    });
});
