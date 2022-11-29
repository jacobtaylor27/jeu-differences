import { Injectable } from '@angular/core';
import { SocketEvent } from '@common/socket-event';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

@Injectable({
    providedIn: 'root',
})
export class ClueHandlerService {
    clueAskedCounter: number = 0;

    constructor(public communicationSocket: CommunicationSocketService, public gameInformation: GameInformationHandlerService) {}

    getNbCluesAsked() {
        return this.clueAskedCounter;
    }

    getClue() {
        this.clueAskedCounter++;
        this.communicationSocket.send(SocketEvent.Clue, { clueIndex: this.clueAskedCounter, gameId: this.gameInformation.roomId });
    }

    resetNbClue() {
        this.clueAskedCounter = 0;
    }
}
