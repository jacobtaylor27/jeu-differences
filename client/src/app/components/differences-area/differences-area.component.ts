import { Component, OnInit } from '@angular/core';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { GameMode } from '@common/game-mode';

@Component({
    selector: 'app-differences-area',
    templateUrl: './differences-area.component.html',
    styleUrls: ['./differences-area.component.scss'],
})
export class DifferencesAreaComponent implements OnInit {
    players: { name: string; nbDifference: string }[];
    private mainPlayer: { name: string; nbDifferences: number };
    private opponentPlayer: { name: string; nbDifferences: number };
    constructor(
        private readonly gameInformationHandlerService: GameInformationHandlerService,
        private readonly differenceDetectionHandler: DifferencesDetectionHandlerService,
    ) {
        this.mainPlayer = this.gameInformationHandlerService.getPlayer();
        this.opponentPlayer = this.gameInformationHandlerService.getOpponent();
        if (!this.isMultiLimited()) {
            this.players = !this.opponentPlayer
                ? [{ name: this.mainPlayer.name, nbDifference: this.setNbDifferencesFound(this.mainPlayer.name) as string }]
                : [
                      { name: this.mainPlayer.name, nbDifference: this.setNbDifferencesFound(this.mainPlayer.name) as string },
                      { name: this.opponentPlayer.name, nbDifference: this.setNbDifferencesFound(this.opponentPlayer.name) as string },
                  ];

            this.gameInformationHandlerService.$differenceFound.subscribe((playerName: string) => {
                const notFindIndex = -1;
                if (this.getPlayerIndex(playerName) === notFindIndex) {
                    return;
                }
                this.players[this.getPlayerIndex(playerName)].nbDifference = this.setNbDifferencesFound(playerName);
            });
        } else {
            this.players = [
                { name: this.mainPlayer.name + ' & ' + this.opponentPlayer.name, nbDifference: this.setNbDifferencesFoundLimitedMulti() as string },
            ];

            this.gameInformationHandlerService.$differenceFound.subscribe(() => {
                this.players[0].nbDifference = this.setNbDifferencesFoundLimitedMulti();
            });
        }
    }

    ngOnInit(): void {
        this.differenceDetectionHandler.resetNumberDifferencesFound();
    }

    isMultiLimited(): boolean {
        return this.gameInformationHandlerService.gameMode === GameMode.LimitedTime && this.gameInformationHandlerService.isMulti;
    }

    getPlayerIndex(playerName: string) {
        return this.players.findIndex((player: { name: string; nbDifference: string }) => player.name === playerName);
    }

    setNbDifferencesFound(playerName: string): string {
        const nbPlayerDifference = this.gameInformationHandlerService.getNbDifferences(playerName);
        if (nbPlayerDifference === undefined) {
            return '';
        }
        if (this.gameInformationHandlerService.gameMode === GameMode.Classic) {
            return nbPlayerDifference.toString() + ' / ' + this.gameInformationHandlerService.getNbTotalDifferences().toString();
        } else {
            return nbPlayerDifference.toString();
        }
    }

    setNbDifferencesFoundLimitedMulti() {
        const nbPlayerDifference = this.gameInformationHandlerService.getNbDifferences(this.mainPlayer.name);
        const nbOpponentDifference = this.gameInformationHandlerService.getNbDifferences(this.opponentPlayer.name);

        if (nbPlayerDifference === undefined || nbOpponentDifference === undefined) {
            return '';
        }
        return (nbPlayerDifference + nbOpponentDifference).toString();
    }
}
