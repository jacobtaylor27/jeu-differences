import { Component, HostListener, OnInit } from '@angular/core';
import { ChatMessage } from '@app/interfaces/chat-message';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { SocketEvent } from '@common/socket-event';
@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit {
    messages: ChatMessage[] = [];
    isAdversaryConnected: boolean;
    currentMessage: string;

    constructor(private readonly communicationSocket: CommunicationSocketService, private gameInformation: GameInformationHandlerService) {}

    @HostListener('window:keyup', ['$event'])
    onDialogClick(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.onClickSend();
        }
    }

    ngOnInit(): void {
        this.isAdversaryConnected = false;
        this.communicationSocket.on(SocketEvent.Message, (message: string) => {
            console.log('message recieved');
            this.messages.push({ content: message, type: 'adversary' });
        });
    }

    onClickSend(): void {
        this.messages.push({ content: this.currentMessage, type: 'personnal' });
        console.log(this.currentMessage);
        this.communicationSocket.send(SocketEvent.Message, { message: this.currentMessage, gameId: this.gameInformation.gameId });
        this.currentMessage = '';
    }
}
