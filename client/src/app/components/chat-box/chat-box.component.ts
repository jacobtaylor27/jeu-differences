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
    isAdversaryConnected: boolean = true;
    currentMessage: string;

    constructor(public communicationSocket: CommunicationSocketService, private gameInformation: GameInformationHandlerService) {}
    @HostListener('window:keyup', ['$event'])
    onDialogClick(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.onClickSend();
        }
    }

    ngOnInit(): void {
        this.communicationSocket.on(SocketEvent.Message, (message: string) => {
            this.addingAdversaryMessage(message);
        });

        // this.communicationSocket.on(SocketEvent.DifferenceFound, () => {});
        // this.communicationSocket.on(SocketEvent.DifferenceNotFound, () => {});
        // this.communicationSocket.on(SocketEvent.LeaveGame, () => {});
    }

    onClickSend(): void {
        this.addingPersonalMessage(this.currentMessage);
        this.communicationSocket.send(SocketEvent.Message, { message: this.currentMessage, roomId: this.gameInformation.roomId });
        this.currentMessage = '';
    }

    addingAdversaryMessage(message: string) {
        this.messages.push({ content: message, type: 'adversary' });
    }

    addingPersonalMessage(message: string) {
        this.messages.push({ content: message, type: 'personal' });
    }

    // private differenceFoundMessage(userName: string, isMulti: boolean) {
    //     let eventMessage: string;
    //     if (isMulti) {
    //         eventMessage = `Difference trouvée par ${userName}`;
    //     } else {
    //         eventMessage = 'Difference trouvée ';
    //     }
    //     this.messages.push({ content: eventMessage, type: 'gameMaster' });
    // }

    // private differenceNotFoundMessage(userName: string, isMulti: boolean) {
    //     let eventMessage: string;
    //     if (isMulti) {
    //         eventMessage = `Erreur par ${userName}`;
    //     } else {
    //         eventMessage = 'Erreur';
    //     }
    //     this.messages.push({ content: eventMessage, type: 'gameMaster' });
    // }

    // private leavingGameMessage(userName: string) {
    //     const eventMessage = `${userName} a abandonné la partie`;
    //     this.messages.push({ content: eventMessage, type: 'gameMaster' });
    // }
}
