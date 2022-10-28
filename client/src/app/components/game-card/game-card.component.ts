import { Component, Input, OnInit } from '@angular/core';
import { TimeFormatter } from '@app/classes/time-formatter';
import { GameCard } from '@app/interfaces/game-card';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { Score } from '@common/score';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-game-card',
    templateUrl: './game-card.component.html',
    styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent implements OnInit {
    @Input() gameCard: GameCard;
    favoriteTheme: string = 'deeppurple-amber-theme';
    imageSrc: string;

    constructor(private readonly communicationSocket: CommunicationSocketService) {}

    ngOnInit() {
        this.setImagesSrc();
        this.listenForOpenLobbies();
    }

    listenForOpenLobbies(): void {
        this.communicationSocket.send(SocketEvent.GetGamesWaiting);

        this.communicationSocket.on(SocketEvent.GetGamesWaiting, (gamesInfo: string[]) => {
            for (const info of gamesInfo) {
                if (this.gameCard.gameInformation.id === info) {
                    this.gameCard.isMulti = true;
                }
            }
        });
    }

    setImagesSrc(): void {
        this.imageSrc = this.gameCard.gameInformation.thumbnail;
    }

    formatScoreTime(scoreTime: number): string {
        return TimeFormatter.getMMSSFormat(scoreTime);
    }

    getGameName(): string {
        return this.gameCard.gameInformation.name;
    }

    isAdminCard(): boolean {
        return this.gameCard.isAdminCard;
    }

    getMultiplayerScores(): Score[] {
        return this.gameCard.gameInformation.multiplayerScore;
    }

    getSinglePlayerScores(): Score[] {
        return this.gameCard.gameInformation.soloScore;
    }

    hasMultiplayerScores(): boolean {
        return this.gameCard.gameInformation.multiplayerScore.length > 0;
    }

    hasSinglePlayerScores(): boolean {
        return this.gameCard.gameInformation.soloScore.length > 0;
    }
}
