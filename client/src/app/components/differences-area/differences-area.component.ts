import { Component, OnInit } from '@angular/core';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

@Component({
    selector: 'app-differences-area',
    templateUrl: './differences-area.component.html',
    styleUrls: ['./differences-area.component.scss'],
})
export class DifferencesAreaComponent implements OnInit {
    name: string;
    nbDifferences: string;
    players: { name: string; nbDifference: string }[];
    constructor(
        private readonly gameInformationHandlerService: GameInformationHandlerService,
        private readonly differenceDetectionHandler: DifferencesDetectionHandlerService,
    ) {
        const mainPlayer = this.gameInformationHandlerService.getPlayer();
        const opponentPlayer = this.gameInformationHandlerService.getOpponent();
        this.players = !opponentPlayer
            ? [{ name: mainPlayer.name, nbDifference: this.setNbDifferencesFound(mainPlayer.name) as string }]
            : [
                  { name: mainPlayer.name, nbDifference: this.setNbDifferencesFound(mainPlayer.name) as string },
                  { name: opponentPlayer.name, nbDifference: this.setNbDifferencesFound(opponentPlayer.name) as string },
              ];
        this.gameInformationHandlerService.$differenceFound.subscribe((playerName: string) => {
            if (!this.getPlayerIndex(playerName)) {
                return;
            }
            this.players[this.getPlayerIndex(playerName)].nbDifference = this.setNbDifferencesFound(playerName);
        });
    }

    ngOnInit(): void {
        this.differenceDetectionHandler.resetNumberDifferencesFound();
    }

    private setNbDifferencesFound(playerName: string): string {
        return (
            this.gameInformationHandlerService.getNbDifferences(playerName)?.toString() +
            ' / ' +
            this.gameInformationHandlerService.getNbTotalDifferences().toString()
        );
    }

    setNbDifferencesFound() {
        if (!this.differenceDetectionHandler.nbDifferencesFound) {
            this.nbDifferences = '0 / ' + this.gameInformationHandlerService.getNbDifferences();
        } else {
            this.nbDifferences = this.differenceDetectionHandler.nbDifferencesFound + ' / ' + this.gameInformationHandlerService.getNbDifferences();
        }
        return this.nbDifferences;
    }
}
