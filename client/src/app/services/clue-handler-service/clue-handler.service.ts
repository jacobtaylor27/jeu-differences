import { Injectable } from '@angular/core';
import { SocketEvent } from '@common/socket-event';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ClueHandlerService {
    clueAskedCounter: number = 0;
    $clueAsked: Subject<void> = new Subject();

    constructor(public communicationSocket: CommunicationSocketService, public gameInformation: GameInformationHandlerService) {}

    getNbCluesAsked() {
        return this.clueAskedCounter;
    }

    getClue() {
        if (!this.isGameOver() && this.clueAskedCounter <= NUMBER_CLUES) {
            this.clueAskedCounter++;
            this.$clueAsked.next();
            this.communicationSocket.send(SocketEvent.Clue, { gameId: this.gameInformation.roomId });
        }
    }

    isGameOver() {
        return this.gameInformation.getNbDifferences(this.gameInformation.getPlayer().name) === this.gameInformation.getNbTotalDifferences();
    }

    resetNbClue() {
        this.clueAskedCounter = 0;
    }
}
