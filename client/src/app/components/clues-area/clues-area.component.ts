import { Component, HostListener, OnInit } from '@angular/core';
import { CluesService } from '@app/services/clues-service/clues.service';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { SocketEvent } from '@common/socket-event';
@Component({
    selector: 'app-clues-area',
    templateUrl: './clues-area.component.html',
    styleUrls: ['./clues-area.component.scss'],
})
export class CluesAreaComponent implements OnInit {
    clueAskedCounter: number = 0;
    isDisabled: boolean = false;
    private numberOfClues: number = 3;

    constructor(
        public clueService: CluesService,
        public communicationSocket: CommunicationSocketService,
        public gameInformation: GameInformationHandlerService,
    ) {}

    @HostListener('window: keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        if (event.key === 'i') {
            if (!this.isDisabled) {
                this.getClue();
            }
        }
    }

    ngOnInit(): void {
        this.isDisabled = this.gameInformation.isMulti;
    }

    getClue() {
        this.clueAskedCounter++;
        if (this.clueAskedCounter === this.numberOfClues) {
            this.isDisabled = true;
        }
        this.communicationSocket.send(SocketEvent.Clue, { clueIndex: this.clueAskedCounter, gameId: this.gameInformation.roomId });
    }
}
