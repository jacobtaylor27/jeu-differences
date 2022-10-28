import { Component, HostListener, OnInit } from '@angular/core';
import { ChatMessage } from '@app/interfaces/chat-message';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { SocketEvent } from '@common/socket-event';
@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit {
    messages: ChatMessage[];
    isAdversaryConnected: boolean;
    currentMessage: string;

    constructor(private readonly communicationSocket: CommunicationSocketService) {}

    @HostListener('window:keyup', ['$event'])
    onDialogClick(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.onClickSend();
        }
    }
    ngOnInit(): void {
        this.isAdversaryConnected = false;
        this.communicationSocket.on(SocketEvent.Message, (message: string) => {
            this.messages.push({ content: message, type: 'adversary' });
        });
    }

    onClickSend(): void {
        this.messages.push({ content: this.currentMessage, type: 'personnal' });
        this.communicationSocket.send(SocketEvent.Message, this.currentMessage);
        this.currentMessage = '';
    }
}
